
import "../../assets/css/instagramFloatingButton.css";

export default function InstagramFloatingStories() {
  const instagramStoriesUrl = "https://www.instagram.com/stories/beliccia.dresscode/";
  return (
    <a
      href={instagramStoriesUrl}
      className="fab-instagram-stories"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Ver Stories de Instagram"
      title="¡Novedades en Stories!"
    >
      <span className="fab-inner">
        <i className="fab fa-instagram" />
      </span>
      <span className="fab-stories-text">¡Visita nuestras stories!</span>
    </a>

  );
}

