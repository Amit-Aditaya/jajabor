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
  video("1.mp4", "Keebabistan"),
  video("2.mp4", "PIO Trailer"),
  video("3.mp4", "Korori"),
  video("4.mp4", "Quazem"),
  video("5.mp4", "Dhaka Flow"),
  video("6.mp4", "Ruma"),
  video("7.mp4", "Photo Walk"),
  video("8.mp4", "An Artist Room"),
  video("9.mp4", "Summer Camp Reel"),
  video("10.mp4", "Kinky Cafe"),
  video("11.mp4", "Forties Tournament"),
  video("12.mp4", "Sakib Bhaiya"),
  video("13.mp4", "Living Room"),
  video("14.mp4", "Morsalin"),
  video("15.mp4", "Drill 1"),
  video("16.mp4", "Summer Camp", true),
  video("17.mp4", "Academy", true),
];
