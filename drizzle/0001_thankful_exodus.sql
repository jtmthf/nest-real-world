CREATE TABLE IF NOT EXISTS "followers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"follower_id" uuid NOT NULL,
	"following_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "followers_follower_id_following_id_unique" UNIQUE("follower_id","following_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "followers" ADD CONSTRAINT "followers_follower_id_users_id_fk" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "followers" ADD CONSTRAINT "followers_following_id_users_id_fk" FOREIGN KEY ("following_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
