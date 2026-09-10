export default function Model3DBlock({
  title,
  src,
  caption,
  attributionText,
  attributionUrl,
}: {
  title?: string;
  src: string;
  caption?: string;
  attributionText: string;
  attributionUrl: string;
}) {
  return (
    <div className="theory-model3d-wrap">
      {title && <h3>{title}</h3>}
      <div className="theory-model3d">
        <iframe
          title={title ?? '3D модел'}
          src={src}
          allow="autoplay; fullscreen; xr-spatial-tracking"
          allowFullScreen
          loading="lazy"
        />
      </div>
      {caption && <p className="theory-model3d-caption">{caption}</p>}
      <p className="theory-model3d-attribution">
        3D модел:{' '}
        <a href={attributionUrl} target="_blank" rel="noreferrer">
          {attributionText}
        </a>{' '}
        (CC BY 4.0)
      </p>
    </div>
  );
}
