namespace DBInterfaces {
  export interface AuthData {
    csrftoken: string;
    codechallenge: string;
    codeverifier: string;
    redirecturi: string;
    gitlabusername?: string;
    authtoken?: string;
  }
}

export default DBInterfaces;
