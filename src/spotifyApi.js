export const login = () => {
	const url = 'https://accounts.spotify.com/authorize';
	const clientId = '4b5e3eb3d3d643daa7f8bfd21f074eda';

	const redirectUri =
		window.location.hostname === 'marcelmichau.github.io'
			? 'https://marcelmichau.github.io/noteworthy'
			: `${window.location.protocol}//${window.location.host}`;

	window.location = `${url}?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=user-library-read user-read-currently-playing user-modify-playback-state`;
};

export const logout = setIsAuthorized => {
	localStorage.removeItem('access_token');

	setIsAuthorized(false);
};

export const getUserDetail = async () => {
	console.log('get user detail called');

	const url = 'https://api.spotify.com/v1/me';

	const accessToken = localStorage.getItem('access_token');

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	const data = await response.json();

	console.log(data);

	return data;
};

export const getUserTracks = async () => {
	console.log('get user artists called');

	let url = 'https://api.spotify.com/v1/me/tracks?limit=50';

	const accessToken = localStorage.getItem('access_token');

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	let data = await response.json();

	url = data.next;

	console.log('next url', url);

	let tracks = data.items;

	while (url !== null) {
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		});

		const data = await response.json();

		tracks = tracks.concat(data.items);

		url = data.next;

		console.log('next url', url);
	}

	return tracks;
};

export const getCurrentlyPlaying = async () => {
	console.log('get currently playing called');

	const url = 'https://api.spotify.com/v1/me/player/currently-playing';

	const accessToken = localStorage.getItem('access_token');

	const response = await fetch(url, {
		headers: {
			Authorization: `Bearer ${accessToken}`
		}
	});

	if (response.status !== 200) return;

	const data = await response.json();

	console.log(data);

	return data;
};

export const setPlayingTrack = async track => {
	console.log('set playing track called');

	const url = 'https://api.spotify.com/v1/me/player/play';

	const accessToken = localStorage.getItem('access_token');

	const response = await fetch(url, {
		method: 'PUT',
		headers: {
			Authorization: `Bearer ${accessToken}`
		},
		body: JSON.stringify({
			uris: [track.uri]
		})
	});

	const data = await response.text();

	return data;
};
