function getEmbedUrl(url) {
  if (!url) return "";

  if (url.includes("/embed/")) {
    return url;
  }

  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1]?.split("?")[0];
    return id ? `https://www.youtube.com/embed/${id}` : "";
  }

  if (url.includes("watch?v=")) {
    const id = url.split("watch?v=")[1]?.split("&")[0];
    return id ? `https://www.youtube.com/embed/${id}` : "";
  }

  return "";
}

function TrailerEmbed({ url, title = "Movie trailer" }) {
  const embedUrl = getEmbedUrl(url);

  console.log("Original trailer URL:", url);
  console.log("Embed trailer URL:", embedUrl);

  if (!embedUrl) {
    return <div className="trailer-fallback">Trailer unavailable</div>;
  }

  return (
    <div className="trailer-frame">
      <iframe
        src={embedUrl}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}

export default TrailerEmbed;