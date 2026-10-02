type NTRIPConfigType = {
    host: string;
    port: number;
    mountpoint: string;
    username: string;
    password: string;
};

export const NTRIPConfig: NTRIPConfigType = {
    host: "www.openservice-sapos.niedersachsen.de",
    port: 2101,
    mountpoint: "VRS_3_4G_NI",
    username: "XYZ",
    password: "ABC",
};

const pgHost = process.env.PGHOST ?? "postgres";
const pgPort = process.env.PGPORT ?? "5432";
const pgUser = process.env.PGUSER ?? "postgres";
const pgPassword = process.env.PGPASSWORD ?? "postgres";
const pgDatabase = process.env.PGDATABASE ?? "gnss";

export const PostgresConnectionString =
    process.env.POSTGRES_URL ??
    `postgresql://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/${pgDatabase}`;