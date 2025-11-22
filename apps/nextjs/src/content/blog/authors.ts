export type Author = {
  name: string;
  role: string;
  image: {
    src: string;
    alt?: string;
  };
};

type Authors = {
  [key: string]: Author;
};

export const authors: Authors = {
  brighton: {
    name: "Brighton Mboya",
    role: "Engineer",
    image: { src: "/static/images/team/tony.jpg" },
  },
  reggie: {
    name: "Reggie Okoko",
    role: "Engineer",
    image: { src: "/images/team/dom.jpeg" },
  },
  
};
