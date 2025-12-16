const client_id = process.env.SPOTIFY_CLIENT_ID?.trim();
const client_secret = process.env.SPOTIFY_CLIENT_SECRET?.trim();
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN?.trim();

const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;

const getAccessToken = async () => {
    const response = await fetch(TOKEN_ENDPOINT, {
        method: "POST",
        headers: {
            Authorization: `Basic ${basic}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refresh_token!,
        }),
    });

    return response.json();
};

export const getNowPlaying = async () => {
    const tokenResponse = await getAccessToken();

    if (!tokenResponse.access_token) {
        // DEBUG: Token generation failed. Return the error details.
        return {
            status: 401,
            text: async () => JSON.stringify({ error: "Token Generation Failed", details: tokenResponse }),
            json: async () => ({ error: "Token Generation Failed", details: tokenResponse })
        } as any;
    }

    const { access_token } = tokenResponse;

    return fetch(NOW_PLAYING_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
};
