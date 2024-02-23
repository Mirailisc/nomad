import Nomad from "./client.js";

// const client = new Nomad({
//   baseUrl: "https://acd18a62-3914-4089-8a2c-53fe676ee3be.mock.pstmn.io",
// });

const client = new Nomad({
  baseUrl: "https://api.myanimelist.net/v2",
});

const res = await client.get(
  "/anime/52991?fields=id,title,main_picture,alternative_titles,start_date,end_date,synopsis,mean,rank,popularity,num_list_users,num_scoring_users,nsfw,created_at,updated_at,media_type,status,genres,my_list_status,num_episodes,start_season,broadcast,source,average_episode_duration,rating,pictures,background,related_anime,related_manga,recommendations,studios,statistics",
  "AnimeInfo",
  {
    headers: {
      "X-MAL-CLIENT-ID": "707168d55e85860a9747d02a4154e726",
    },
  }
);

console.log(res.data);
