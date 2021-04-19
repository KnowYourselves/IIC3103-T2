const annotateArtist = (artist, req) => {
  const host = `${req.protocol}://${req.get('host')}/artists/${artist.id}`;
  return {
    ...artist,
    albums: `${host}/albums`,
    tracks: `${host}/tracks`,
    self: `${host}`,
  };
};

const annotateAlbum = (album, req) => {
  const host = `${req.protocol}://${req.get('host')}`;
  return {
    ...album,
    artist: `${host}/artists/${album.artist_id}`,
    tracks: `${host}/albums/${album.id}/tracks`,
    self: `${host}/albums/${album.id}`,
  };
};

const annotateTrack = (track, req) => {
  const host = `${req.protocol}://${req.get('host')}`;
  const { album: { artist_id: artistId }, ...rest } = track;
  return {
    ...rest,
    artist: `${host}/artists/${artistId}`,
    album: `${host}/albums/${track.album_id}`,
    self: `${host}/tracks/${track.id}`,
  };
};

module.exports = {
  annotateAlbum,
  annotateArtist,
  annotateTrack,
};
