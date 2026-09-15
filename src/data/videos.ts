const VIDEO_DIR = "/images/portfolio/Videos";

function src(file: string) {
  return encodeURI(`${VIDEO_DIR}/${file}`);
}

function poster(file: string) {
  return encodeURI(`${VIDEO_DIR}/posters/${file}.jpg`);
}

export type PortfolioVideo = {
  id: string;
  title: string;
  src: string;
  poster: string;
  landscape?: boolean;
};

function video(file: string, title: string, landscape = false): PortfolioVideo {
  return {
    id: file,
    title,
    src: src(file),
    poster: poster(file),
    landscape,
  };
}

export const videos: PortfolioVideo[] = [
  video("An Artist room.mp4", "An Artist Room"),
  video("Photo walk.mp4", "Photo Walk"),
  video("DhakaFlow.mp4", "Dhaka Flow"),
  video("moire studio_living room_reEdit.mp4", "Living Room"),
  video("PIO_Trailer.mp4", "PIO Trailer"),
  video("KinkyCafe_16thDec.mp4", "Kinky Cafe"),
  video("KORORI_STUDIO MOIRE(1).mp4", "Korori"),
  video("Moire_Keebabistan_final_x.mp4", "Keebabistan"),
  video("Ruma(3).mp4", "Ruma"),
  video("Quazem_reel1.mp4", "Quazem"),
  video("SakibBhaiya_reel.mp4", "Sakib Bhaiya"),
  video("Morsalin_reel_wKids.mp4", "Morsalin"),
  video("AhnafSirReel_summerCampv2(1).mp4", "Summer Camp Reel"),
  video("Drill 1 - Vlad.mp4", "Drill 1"),
  video("Forties tournament_amit bhaiya_FINAL.mp4", "Forties Tournament"),
  video("Summer camp Final video_re edited(1).mp4", "Summer Camp", true),
  video("Academy video_Sharan.mp4", "Academy", true),
];
