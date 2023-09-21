# SaaSMap-client
A React client for interacting with SaaSMap-server, written in React.

Future commits for the client will include an expansion of features such as visualizations of bad login events as opposed to just the display of valid logins, and any other additions requested for, as this is a webapp currently in use by a client. Also to be replaced is the `useEffect()` with the amateurish `window.location.reload()` called by `setTimeout()` every three minutes, or, as written in `App.js`, every 150,000 seconds; this was a quick fix to get around additional maps being re-rendered atop the old ones whenever new data was requested from SaaSMap-server.
