'use client'

import {useEffect, useMemo, useState} from "react";
import {api} from "@/lib/api";

type ApiResult = {
    id: string;
    event: string;
    date: string;
    distance: string;
    time: string;
};

type Result = ApiResult & {
    dateLabel: string;
    seconds: number;
};

type DistanceOption = {
    id: string;
    label: string;
    results: Result[];
};

type MonitoringApiResponse = {
    results: ApiResult[];
};

const chart = {
    width: 800,
    height: 340,
    left: 64,
    right: 24,
    top: 28,
    bottom: 52,
};

function parseTime(value: string): number | null {
    const parts = value.trim().split(":");

    if (parts.length < 1 || parts.length > 3 || parts.some(part => part === "")) {
        return null;
    }

    const numbers = parts.map(Number);
    if (numbers.some(part => !Number.isFinite(part) || part < 0)) {
        return null;
    }

    if (parts.length === 1) {
        return numbers[0];
    }

    if (numbers.slice(1).some(part => part >= 60)) {
        return null;
    }

    return numbers.reduce((seconds, part) => seconds * 60 + part, 0);
}

function formatTime(seconds: number): string {
    if (seconds < 60) {
        return `${seconds.toFixed(2)} sec`;
    }

    const minutes = Math.floor(seconds / 60);
    const remainder = Math.floor(seconds % 60);
    const hundredths = Math.round((seconds % 1) * 100);

    return `${minutes}:${String(remainder).padStart(2, "0")}.${String(hundredths).padStart(2, "0")}`;
}

function formatRaceDate(date: string): string {
    const parsedDate = new Date(date.length === 10 ? `${date}T12:00:00` : date);

    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(parsedDate);
}

function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : "Unknown error";
}

export default function MonitoringPage() {
    const [results, setResults] = useState<Result[]>([]);
    const [selectedDistance, setSelectedDistance] = useState("");
    const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        const getResults = async () => {
            setLoading(true);
            setError("");

            try {
                // Expected API response: { results: [{ id, event, date, distance, time }] }
                const response = await api.get<MonitoringApiResponse>("/monitoring/results");
                const data = response.data?.results;

                if (!Array.isArray(data)) {
                    throw new Error("The monitoring API returned an invalid results list.");
                }

                const parsedResults = data.map((item): Result => {
                    const seconds = parseTime(item.time);
                    const parsedDate = new Date(item.date);

                    if (
                        !item.id
                        || !item.event
                        || !item.distance
                        || !item.time
                        || !Number.isFinite(parsedDate.getTime())
                        || seconds === null
                    ) {
                        throw new Error("A monitoring result has invalid or missing fields.");
                    }

                    return {
                        ...item,
                        seconds,
                        dateLabel: new Intl.DateTimeFormat("en-US", {
                            month: "short",
                            day: "2-digit",
                        }).format(parsedDate),
                    };
                }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                if (isMounted) {
                    setResults(parsedResults);
                    setSelectedDistance(current =>
                        parsedResults.some(result => result.distance === current)
                            ? current
                            : parsedResults[0]?.distance ?? "",
                    );
                }
            } catch (requestError) {
                if (isMounted) {
                    setError(`Could not load race results: ${getErrorMessage(requestError)}`);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        getResults();
        return () => {
            isMounted = false;
        };
    }, []);

    const distances = useMemo<DistanceOption[]>(() => {
        const labels = [...new Set(results.map(result => result.distance))];
        return labels.map(label => ({
            id: label,
            label,
            results: results.filter(result => result.distance === label),
        }));
    }, [results]);

    const distance = distances.find(item => item.id === selectedDistance);
    const distanceResults = distance?.results ?? [];
    const bestResult = distanceResults.length
        ? distanceResults.reduce((best, result) => result.seconds < best.seconds ? result : best)
        : null;
    const firstResult = distanceResults[0];
    const latestResult = distanceResults[distanceResults.length - 1];
    const improvement = firstResult && latestResult
        ? ((firstResult.seconds - latestResult.seconds) / firstResult.seconds) * 100
        : 0;
    const selectedResult = distanceResults.find(result => result.id === selectedResultId);

    const {points, linePath, areaPath, ticks} = useMemo(() => {
        if (distanceResults.length === 0) {
            return { points: [], linePath: "", areaPath: "", ticks: [] };
        }

        const values = distanceResults.map(result => result.seconds);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const padding = Math.max((max - min) * 0.24, distance?.id.toLowerCase().includes("m") ? 0.5 : 20);
        const low = Math.max(0, min - padding);
        const high = max + padding;
        const plotWidth = chart.width - chart.left - chart.right;
        const plotHeight = chart.height - chart.top - chart.bottom;

        const mappedPoints = distanceResults.map((result, index) => {
            const x = chart.left + (distanceResults.length === 1 ? 0.5 : index / (distanceResults.length - 1)) * plotWidth;
            const y = chart.top + ((high - result.seconds) / (high - low)) * plotHeight;
            return { ...result, x, y };
        });

        const line = mappedPoints
            .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
            .join(" ");
        const area = `${line} L ${mappedPoints[mappedPoints.length - 1].x} ${chart.height - chart.bottom} L ${mappedPoints[0].x} ${chart.height - chart.bottom} Z`;
        const yTicks = Array.from({ length: 5 }, (_, index) => {
            const value = high - ((high - low) * index) / 4;
            return {
                value,
                y: chart.top + (plotHeight * index) / 4,
            };
        });

        return { points: mappedPoints, linePath: line, areaPath: area, ticks: yTicks };
    }, [distance?.id, distanceResults]);

    const updateDistance = (id: string) => {
        setSelectedDistance(id);
        setSelectedResultId(null);
    };

    return (
        <main className="monitoring-page">
            <header className="monitoring-heading">
                <div>
                    <p className="monitoring-eyebrow">YOUR PERFORMANCE, IN FOCUS</p>
                    <h1>Progress monitoring</h1>
                    <p className="monitoring-subtitle">
                        Track your race times and see how every effort moves you forward.
                    </p>
                </div>
                <span className="monitoring-period">
                    <span aria-hidden="true" />
                    Race results
                </span>
            </header>

            {loading && <p className="monitoring-state">Loading your race results…</p>}
            {!loading && error && <p className="monitoring-state monitoring-state-error" role="alert">{error}</p>}
            {!loading && !error && results.length === 0 && (
                <section className="monitoring-state monitoring-empty-state">
                    <span className="monitoring-empty-icon" aria-hidden="true">↗</span>
                    <h2>No race results yet</h2>
                    <p>Add a competition with a finishing time to see your progress chart.</p>
                </section>
            )}

            {!loading && !error && distance && bestResult && firstResult && latestResult && (
                <>
                    <section className="monitoring-summary" aria-label={`${distance.label} summary`}>
                        <article className="monitoring-stat monitoring-stat-primary">
                            <span>Personal best</span>
                            <strong>{formatTime(bestResult.seconds)}</strong>
                            <small>{distance.label} · {bestResult.dateLabel}</small>
                        </article>
                        <article className="monitoring-stat">
                            <span>Latest result</span>
                            <strong>{formatTime(latestResult.seconds)}</strong>
                            <small>{latestResult.event}</small>
                        </article>
                        <article className="monitoring-stat">
                            <span>Improvement</span>
                            <strong className="monitoring-improvement">
                                {improvement > 0 ? `−${improvement.toFixed(1)}%` : improvement < 0 ? `+${Math.abs(improvement).toFixed(1)}%` : "—"}
                            </strong>
                            <small>Since first recorded race</small>
                        </article>
                    </section>

                    <section className="performance-card" aria-labelledby="performance-title">
                        <div className="performance-toolbar">
                            <div>
                                <p className="monitoring-eyebrow">RACE RESULTS</p>
                                <h2 id="performance-title">Your times over the season</h2>
                            </div>
                            <div className="distance-picker" role="group" aria-label="Choose race distance">
                                {distances.map(option => (
                                    <button
                                        key={option.id}
                                        type="button"
                                        className={option.id === selectedDistance ? "distance-option selected" : "distance-option"}
                                        aria-pressed={option.id === selectedDistance}
                                        onClick={() => updateDistance(option.id)}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="chart-legend">
                            <span className="legend-line" />
                            <span>Race time</span>
                            <span className="legend-best-dot" />
                            <span>Personal best</span>
                            <span className="chart-better-note">Lower time is better <span aria-hidden="true">↑</span></span>
                        </div>

                        {selectedResult && (
                            <div className="result-tooltip" role="status" aria-live="polite">
                                <div>
                                    <span className="result-tooltip-date">{formatRaceDate(selectedResult.date)}</span>
                                    <strong>{selectedResult.event}</strong>
                                </div>
                                <div className="result-tooltip-time">
                                    <span>{distance.label}</span>
                                    <strong>{formatTime(selectedResult.seconds)}</strong>
                                </div>
                            </div>
                        )}

                        <div className="performance-chart">
                            <svg
                                viewBox={`0 0 ${chart.width} ${chart.height}`}
                                role="img"
                                aria-label={`Race times for ${distance.label}; lower times are better`}
                                preserveAspectRatio="xMidYMid meet"
                            >
                                <defs>
                                    <linearGradient id="performance-area-gradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#37d6ae" stopOpacity=".24" />
                                        <stop offset="100%" stopColor="#37d6ae" stopOpacity="0" />
                                    </linearGradient>
                                </defs>

                                {ticks.map((tick, index) => (
                                    <g key={index}>
                                        <line
                                            x1={chart.left}
                                            x2={chart.width - chart.right}
                                            y1={tick.y}
                                            y2={tick.y}
                                            className="chart-grid-line"
                                        />
                                        <text x={chart.left - 12} y={tick.y + 4} textAnchor="end" className="chart-axis-label">
                                            {formatTime(tick.value).replace(" sec", "")}
                                        </text>
                                    </g>
                                ))}

                                <path d={areaPath} fill="url(#performance-area-gradient)" />
                                <path d={linePath} className="chart-result-line" />

                                {points.map((point, index) => (
                                    <g key={point.id}>
                                        {point.id === bestResult.id && (
                                            <circle cx={point.x} cy={point.y} r="12" className="chart-best-glow" />
                                        )}
                                        <circle
                                            cx={point.x}
                                            cy={point.y}
                                            r={selectedResultId === point.id ? 8 : 6}
                                            className={[
                                                "chart-result-point",
                                                point.id === bestResult.id ? "is-best" : "",
                                                selectedResultId === point.id ? "is-selected" : "",
                                            ].filter(Boolean).join(" ")}
                                            role="button"
                                            tabIndex={0}
                                            aria-label={`${point.event}, ${formatRaceDate(point.date)}, ${formatTime(point.seconds)}`}
                                            aria-pressed={selectedResultId === point.id}
                                            onMouseEnter={() => setSelectedResultId(point.id)}
                                            onFocus={() => setSelectedResultId(point.id)}
                                            onClick={() => setSelectedResultId(point.id)}
                                            onKeyDown={event => {
                                                if (event.key === "Enter" || event.key === " ") {
                                                    event.preventDefault();
                                                    setSelectedResultId(point.id);
                                                }
                                            }}
                                        />
                                        {(index === 0 || index === Math.floor((points.length - 1) / 2) || index === points.length - 1) && (
                                            <text
                                                x={point.x}
                                                y={chart.height - 18}
                                                textAnchor="middle"
                                                className="chart-date-label"
                                            >
                                                {point.dateLabel}
                                            </text>
                                        )}
                                    </g>
                                ))}
                            </svg>
                        </div>

                        <footer className="chart-footer">
                            <span>{distanceResults.length} race results</span>
                            <span>Tap or hover a point to see its result</span>
                        </footer>
                    </section>
                </>
            )}
        </main>
    );
}
