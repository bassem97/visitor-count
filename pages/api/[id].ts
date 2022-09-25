import type { NextApiRequest, NextApiResponse } from "next";
import {
  zero,
  one,
  two,
  three,
  four,
  five,
  six,
  seven,
  eight,
  nine,
} from "../../libs/numbers";
import { initializeApp } from "firebase/app";
import { child, get, getDatabase, ref, set } from "firebase/database";
import getImg from "../../libs/getImg";
import fillGaps from "../../libs/fillGaps";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "visitor-count-66755.firebaseapp.com",
    projectId: "visitor-count-66755",
    storageBucket: "visitor-count-66755.appspot.com",
    messagingSenderId: "618673330830",
    appId: "1:618673330830:web:73f8178c7fa23cb87407df",
    databaseURL:
      "https://visitor-count-66755-default-rtdb.europe-west1.firebasedatabase.app",
  };

  await initializeApp(firebaseConfig);

  const dbRef = await ref(getDatabase());
  get(child(dbRef, `users/`))
    .then(async snapshot => {
      if (snapshot.exists()) {
        const visits = (snapshot.val()[`${id}`] || 0) + 1;

        const db = await getDatabase();
        await set(ref(db, "users/" + id), visits);

        res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
        res.send(
          `<svg
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="315"
        height="100"
        version="1.1"
        style="filter: invert(68%) sepia(17%) saturate(1307%) hue-rotate(106deg) brightness(94%) contrast(91%);">
      <title>Visitor Count</title>
      <g>
        ${fillGaps(visits)
          .map((d: string, i: number) => {
            const number =
              d === "1"
                ? one
                : d === "2"
                ? two
                : d === "3"
                ? three
                : d === "4"
                ? four
                : d === "5"
                ? five
                : d === "6"
                ? six
                : d === "7"
                ? seven
                : d === "8"
                ? eight
                : d === "9"
                ? nine
                : zero;

            return getImg(i * 35, number);
          })
          .join("")}
      </g>
    </svg>`
        );
      }
    })
    .catch(error => {
      console.error(error);
    });
}
