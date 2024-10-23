import { Elysia } from "elysia";

/** InfluxDB v2 URL */
const url = process.env.INFLUX_URL || "http://localhost:8086";
/** InfluxDB authorization token */
const token = process.env.INFLUXDB_TOKEN || "my-token";
/** Organization within InfluxDB  */
const org = process.env.INFLUX_ORG || "my-org";
/**InfluxDB bucket used in examples  */
const bucket = process.env.INFLUX_BUCKET || "my-bucket";
// ONLY onboarding example
/**InfluxDB user  */
const username = "admin";
/**InfluxDB password  */
const password = "P@ssw0rd";

// repl.repl.ignoreUndefined=true

const { InfluxDB, Point } = require("@influxdata/influxdb-client");

const client = new InfluxDB({ url, token });

let writeClient = client.getWriteApi(org, bucket, 'ns')

// for (let i = 0; i < 5; i++) {
//   let point = new Point('measurement1')
//     .tag('tagname1', 'tagvalue1')
//     .intField('field1', i)

//   void setTimeout(() => {
//     writeClient.writePoint(point)
//   }, i * 1000) // separate points by 1 second

//   void setTimeout(() => {
//     writeClient.flush()
//   }, 5000)
// }

let queryClient = client.getQueryApi(org)
let fluxQuery = `from(bucket: "bucket")
 |> range(start: -10m)
 |> filter(fn: (r) => r._measurement == "measurement1")`

queryClient.queryRows(fluxQuery, {
  next: (row: any, tableMeta: any) => {
    const tableObject = tableMeta.toObject(row)
    console.log(tableObject)
  },
  error: (error: any) => {
    console.error('\nError', error)
  },
  complete: () => {
    console.log('\nSuccess')
  },
})

queryClient = client.getQueryApi(org)
fluxQuery = `from(bucket: "bucket")
 |> range(start: -10m)
 |> filter(fn: (r) => r._measurement == "measurement1")
 |> mean()`

// queryClient.queryRows(fluxQuery, {
//   next: (row, tableMeta) => {
//     const tableObject = tableMeta.toObject(row)
//     console.log(tableObject)
//   },
//   error: (error) => {
//     console.error('\nError', error)
//   },
//   complete: () => {
//     console.log('\nSuccess')
//   },
// })

const app = new Elysia().get("/", () => "Hello Elysia").listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
