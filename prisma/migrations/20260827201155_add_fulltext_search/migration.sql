-- ============ Projects ============
ALTER TABLE "projects" ADD COLUMN "searchVector" tsvector;

CREATE OR REPLACE FUNCTION projects_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW."searchVector" :=
    setweight(to_tsvector('english', coalesce(NEW."title", '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW."shortSummary", '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW."description", '')), 'C') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW."metaKeywords", ' '), '')), 'D');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_search_vector_trigger
BEFORE INSERT OR UPDATE ON "projects"
FOR EACH ROW EXECUTE FUNCTION projects_search_vector_update();

UPDATE "projects" SET "searchVector" =
  setweight(to_tsvector('english', coalesce("title", '')), 'A') ||
  setweight(to_tsvector('english', coalesce("shortSummary", '')), 'B') ||
  setweight(to_tsvector('english', coalesce("description", '')), 'C') ||
  setweight(to_tsvector('english', coalesce(array_to_string("metaKeywords", ' '), '')), 'D');

CREATE INDEX "projects_search_vector_idx" ON "projects" USING GIN ("searchVector");

-- ============ BlogPost ============
ALTER TABLE "blog_posts" ADD COLUMN "searchVector" tsvector;

CREATE OR REPLACE FUNCTION blog_posts_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW."searchVector" :=
    setweight(to_tsvector('english', coalesce(NEW."title", '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW."excerpt", '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW."tags", ' '), '')), 'B') ||
    setweight(to_tsvector('english', coalesce(NEW."content", '')), 'C');
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_search_vector_trigger
BEFORE INSERT OR UPDATE ON "blog_posts"
FOR EACH ROW EXECUTE FUNCTION blog_posts_search_vector_update();

UPDATE "blog_posts" SET "searchVector" =
  setweight(to_tsvector('english', coalesce("title", '')), 'A') ||
  setweight(to_tsvector('english', coalesce("excerpt", '')), 'B') ||
  setweight(to_tsvector('english', coalesce(array_to_string("tags", ' '), '')), 'B') ||
  setweight(to_tsvector('english', coalesce("content", '')), 'C');

CREATE INDEX "blog_posts_search_vector_idx" ON "blog_posts" USING GIN ("searchVector");