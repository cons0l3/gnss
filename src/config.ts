type NTRIPConfigType = {
    host: string;
    port: number;
    mountpoint: string;
    username: string;
    password: string;
};

export const NTRIPConfig: NTRIPConfigType = {
    host: process.env.NTRIP_HOST || "www.openservice-sapos.niedersachsen.de",
    port: Number(process.env.NTRIP_PORT || 2101),
    mountpoint: process.env.NTRIP_MOUNTPOINT || "VRS_3_4G_NI",
    username: process.env.NTRIP_USERNAME || "XYZ",
    password: process.env.NTRIP_PASSWORD || "ABC",
};

const pgHost = process.env.PGHOST || "postgres";
const pgPort = process.env.PGPORT || "5432";
const pgUser = process.env.PGUSER || "postgres";
const pgPassword = process.env.PGPASSWORD || "postgres";
const pgDatabase = process.env.PGDATABASE || "gnss";

export const PostgresConnectionString =
    process.env.POSTGRES_URL ||
    `postgresql://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/${pgDatabase}`;