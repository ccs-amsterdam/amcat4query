import Axios, { AxiosError, AxiosInstance } from "axios";
import { AggregateData, AggregationAxis, AmcatField, AmcatQuery } from "../interfaces";

/**
 * Class for doing all stuff AmCAT
 */
export default class Amcat {
  host: string;
  email: string;
  token: string;
  api: AxiosInstance;

  constructor(host: string, email: string, token: string) {
    this.host = host;
    this.email = email;
    this.token = token;
    this.api = Axios.create({
      baseURL: host,
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  serialize() {
    return { host: this.host, email: this.email, token: this.token };
  }
  static deserialize(obj: { host: string; email: string; token: string }) {
    return new Amcat(obj.host, obj.email, obj.token);
  }

  // GET
  getToken() {
    return this.api.get("/auth/token/");
  }
  getIndices() {
    return this.api.get(`/index/`);
  }
  getIndex(index: string) {
    return this.api.get(`/index/${index}`);
  }
  getFields(index: string) {
    return this.api.get(`/index/${index}/fields`);
  }

  /** Get the values for a field
   * @param index Index name
   * @param field Field name
   * @param setData Callback function to call on success
   * @param setError Callback function to call on failure
   */
  getFieldValues(
    index: string,
    field: string,
    setData: (data: string[]) => void,
    setError: (error: string) => void
  ) {
    return this.api
      .get(`/index/${index}/fields/${field}/values`)
      .then((result) => setData(result.data))
      .catch((error) => setError(describeError(error)));
  }
  getDocument(index: string, doc_id: string | number) {
    return this.api.get(`/index/${index}/documents/${doc_id}`);
  }

  // POST
  postQuery(index: string, query = {}, params = {}) {
    return this.api.post(`/index/${index}/query`, { ...query, ...params });
  }

  /** POST an aggregate query to AmCAT
   * @param index Index name
   * @param query A Query to determine which documents will be aggregated (e.g. SQL where)
   * @param axes The aggregation axes (e.g. SQL group by)
   * @param setData Callback function that will be called with the data after a succesful call
   * @param setError Callback function that will be called with an error message on failure
   */
  postAggregate(
    index: string,
    query: AmcatQuery,
    axes: AggregationAxis[],
    setData: (data: AggregateData) => void,
    setError: (error: string) => void
  ) {
    const params: any = { ...query };
    if (axes) params["axes"] = axes;
    return this.api
      .post(`/index/${index}/aggregate`, { ...params })
      .then((d) => setData(d.data))
      .catch((e) => setError(describeError(e)));
  }

  createIndex(name: string, guestRole = "NONE") {
    const body: any = { name: name };
    if (guestRole !== "NONE") body.guest_role = guestRole;
    return this.api.post(`/index/`, body);
  }

  createDocuments(
    name: string,
    documents: { title: string; date: string; text: string }[],
    columns = {}
  ) {
    // documentList should be an array of objects with at least the fields title, date and text
    return this.api.post(`/index/${name}/documents`, { documents, columns });
  }

  // DELETE
  deleteIndex(index: string) {
    return this.api.delete(`/index/${index}`);
  }
}

/**
 * Get AmCAT token
 * @param {*} host      The amcat Host adress
 * @param {*} email     User email
 * @param {*} password  User password
 * @returns
 */
export async function getToken(host: string, email: string, password: string) {
  const response = await Axios.get(`${host}/auth/token/`, {
    auth: { username: email, password: password },
  });
  return response.data.token;
}

function describeError(e: AxiosError): string {
  if (e.response) return `HTTP error ${e.response.status}`;
  if (e.request) return "No reply from server";
  return "Something went wrong trying to query the AmCAT backend";
}

/**
 * Get the AmcatField corresponding to this fieldname
 * @param fields the fields in this index
 * @param fieldname the name to search for
 * @returns the field where field.name === fieldname, or undefined
 */
export function getField(fields: AmcatField[], fieldname: string): AmcatField {
  const i = fields.map((f) => f.name).indexOf(fieldname);
  if (i === -1) return undefined;
  return fields[i];
}
