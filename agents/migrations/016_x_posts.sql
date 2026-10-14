-- Posts for the owner's X account. The text is seeded from content/x-posts.json; the owner publishes by hand via a web intent.
CREATE TABLE IF NOT EXISTS x_posts (
  day integer PRIMARY KEY,
  text text NOT NULL,
  image text,
  published_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);
