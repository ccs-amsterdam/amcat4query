import Axios, { AxiosInstance } from "axios";
import { AggregateData, AggregationAxis, AmcatQuery } from "../interfaces";

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
  getFieldValues(index: string, field: string) {
    return this.api.get(`/index/${index}/fields/${field}/values`);
  }
  getDocument(index: string, doc_id: string | number) {
    return this.api.get(`/index/${index}/documents/${doc_id}`);
  }

  // POST
  postQuery(index: string, query = {}, params = {}) {
    return this.api.post(`/index/${index}/query`, { ...query, ...params });
  }

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
      .catch((e) => {
        if (e.response) setError(`HTTP error ${e.response.status}`);
        else if (e.request) setError("No reply from server");
        else setError("Something went wrong trying to run the query");
      });
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
