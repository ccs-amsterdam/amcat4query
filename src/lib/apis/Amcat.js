import Axios from "axios";

/**
 * Class for doing all stuff AmCAT
 */
export default class Amcat {
  constructor(host, email, token) {
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
  static deserialize(obj) {
    return new Amcat(obj.host, obj.email, obj.token);
  }

  // GET
  getToken() {
    return this.api.get("/auth/token/");
  }
  getIndices() {
    return this.api.get(`/index/`);
  }
  getIndex(index) {
    return this.api.get(`/index/${index}`);
  }
  getFields(index) {
    return this.api.get(`/index/${index}/fields`);
  }
  getFieldValues(index, field) {
    return this.api.get(`/index/${index}/fields/${field}/values`);
  }
  getDocument(index, doc_id) {
    return this.api.get(`/index/${index}/documents/${doc_id}`);
  }

  // POST
  postQuery(index, params = {}, filters = {}) {
    if (filters) params["filters"] = filters;
    return this.api.post(`/index/${index}/query`, { ...params });
  }
  postAggregate(index, params = {}, filters = {}, axes = {}) {
    if (filters) params["filters"] = filters;
    if (axes) params["axes"] = axes;
    return this.api.post(`/index/${index}/aggregate`, { ...params });
  }

  createIndex(name, guestRole = "NONE") {
    const body = { name: name };
    if (guestRole !== "NONE") body.guest_role = guestRole;
    return this.api.post(`/index/`, body);
  }
  createDocuments(name, documents, columns = {}) {
    // documentList should be an array of objects with at least the fields title, date and text
    return this.api.post(`/index/${name}/documents`, { documents, columns });
  }

  // DELETE
  deleteIndex(index) {
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
export async function getToken(host, email, password) {
  const response = await Axios.get(`${host}/auth/token/`, {
    auth: { username: email, password: password },
  });
  return response.data.token;
}
