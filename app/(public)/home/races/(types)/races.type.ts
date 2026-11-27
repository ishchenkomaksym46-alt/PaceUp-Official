export type DistanceType = {
    distance: string;
    time: string;
}

export type RaceType = {
    id: string;
    name: string;
    distances: DistanceType[];
    date: string;
    type: 'Upcoming' | 'Ended'
    createdAt: string;
}