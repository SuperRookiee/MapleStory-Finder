import { supabase } from "@/libs/supabaseClient";

export const getFavorites = async (userId: string) => {
  const { data } = await supabase
    .from("favorite")
    .select("ocid")
    .eq("user_id", userId);
  return data?.map((f) => f.ocid as string) ?? [];
};

export const addFavorite = async (userId: string, ocid: string) => {
  await supabase.from("favorite").upsert({ user_id: userId, ocid });
};

export const removeFavorite = async (userId: string, ocid: string) => {
  await supabase
    .from("favorite")
    .delete()
    .eq("user_id", userId)
    .eq("ocid", ocid);
};
