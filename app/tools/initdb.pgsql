-- Drops old tables
DROP TABLE IF EXISTS players;

CREATE TABLE IF NOT EXISTS auth_data (
    csrfToken text NOT NULL PRIMARY KEY,
    codeChallenge text NOT NULL,
    codeVerifier text NOT NULL,
    redirectURI text NOT NULL,
    gitlabUsername text,
    authToken text
);