import Axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { SemanticICONS } from "semantic-ui-react";
import { AggregationOptions, AmcatDocument, AmcatField, AmcatFilters } from ".";
import { AmcatIndex, AmcatQuery, AmcatUser } from "./interfaces";

// Server-level functions, i.e. not linked to an index

function api_user(user: AmcatUser) {
  return Axios.create({
    baseURL: `${user.host}`,
    headers: { Authorization: `Bearer ${user.token}` },
  });
}

/** Get index details / check if an index exists */
export function getIndex(user: AmcatUser, index: string) {
  return api_user(user).get(`/index/${index}`);
}

/** Create an index */
export function createIndex(user: AmcatUser, name: string, guestRole = "NONE") {
  const body: any = { name: name };
  if (guestRole !== "NONE") body.guest_role = guestRole;
  return api_user(user).post(`/index/`, body);
}

/** Get the list of indices on this server */
export function getIndices(user: AmcatUser) {
  return api_user(user).get(`/index/`);
}

// Functions on an index

function api(index: AmcatIndex) {
  return Axios.create({
    baseURL: `${index.host}/index/${index.index}`,
    headers: { Authorization: `Bearer ${index.token}` },
  });
}

export function createDocuments(index: AmcatIndex, documents: AmcatDocument[], columns = {}) {
  // documentList should be an array of objects with at least the fields title, date and text
  return api(index).post(`/documents`, { documents, columns });
}

/** DELETE this index */
export function deleteIndex(index: AmcatIndex) {
  // This is silly, but using api(index) with url "" doesn't work :(
  return api_user(index).delete(`/index/${index.index}`);
}

/** POST an AmcatQuery and fetch the resulting articles */
export function postQuery(index: AmcatIndex, query: AmcatQuery, params: any) {
  return api(index).post("/query", { ...query, ...params });
}

/** List all fields in this index */
export function getFields(index: AmcatIndex) {
  return api(index).get("/fields");
}

/** Get the values for a field
 * @param index Index name
 * @param field Field name
 */
export function getFieldValues(index: AmcatIndex, field: string) {
  return api(index).get(`/fields/${field}/values`);
}

/** POST an aggregate query to AmCAT
 * @param index Index name
 * @param query A Query to determine which documents will be aggregated (e.g. SQL where)
 * @param axes The aggregation axes (e.g. SQL group by)
 * @param setData Callback function that will be called with the data after a succesful call
 * @param setError Callback function that will be called with an error message on failure
 */
export function postAggregate(index: AmcatIndex, query: AmcatQuery, options: AggregationOptions) {
  const params: any = { ...query };
  if (options?.axes) params["axes"] = options.axes;
  if (options?.metrics) params["aggregations"] = options.metrics;
  return api(index).post(`/aggregate`, params);
}

/**
 * Get AmCAT token
 * @param {*} host      The amcat Host adress
 * @param {*} email     User email
 * @param {*} password  User password
 * @returns
 */
export async function getToken(host: string, email: string, password: string) {
  const response = await Axios.get(`${host}/auth/token`, {
    auth: { username: email, password: password },
  });
  return response.data.token;
}

/**
 * Refresh AmCAT token
 * @param {*} host      The amcat Host adress
 * @param {*} token     Token
 * @returns
 */
export function refreshToken(user: AmcatUser) {
  return api_user(user).get("/auth/token");
}

export function describeError(e: AxiosError): string {
  if (e.response) return `HTTP error ${e.response.status}`;
  if (e.request) return "No reply from server";
  return "Something went wrong trying to query the AmCAT backend";
}

export function addFilter(q: AmcatQuery, filters: AmcatFilters): AmcatQuery {
  if (q == null) q = {};
  return { queries: { ...q.queries }, filters: { ...q.filters, ...filters } };
}

/** Hook to get fields from amcat
 * @param index Login information for this index
 * @returns a list of field objects
 */
export default function useFields(index: AmcatIndex): AmcatField[] {
  const [fields, setFields] = useState<AmcatField[]>([]);

  useEffect(() => {
    if (index) {
      getFields(index)
        .then((res: any) => {
          setFields(Object.values(res.data));
        })
        .catch((_e: Error) => {
          setFields([]);
        });
    } else {
      setFields([]);
    }
  }, [index]);

  return Object.values(fields);
}

export function getField(fields: AmcatField[], fieldname: string) {
  const i = fields.map((f) => f.name).indexOf(fieldname);
  if (i === -1) return undefined;
  return fields[i];
}

const ICONS: { [field: string]: SemanticICONS } = {
  date: "calendar alternate outline",
  keyword: "list",
};

export function getFieldTypeIcon(fieldtype: string) {
  return ICONS[fieldtype];
}
