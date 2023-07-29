import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";
import siteConfig from "./lib/siteConfig.js";
// const url = "https://animeindo.quest/pages/episode-terbaru/";
const baseURL = siteConfig.scraptUrl;

const app = express();

const port = process.env.PORT || 5000;

let episodeTerbaru = [];

const fetchData = async (page) => {
  try {
    let res = await axios.get(`${baseURL}/pages/episode-terbaru/page/${page}`);
    let $ = await cheerio.load(res.data);
    $("#main > div.post-show > article").each((i, e) => {
      episodeTerbaru.push({
        title: $(e)
          .find("div.animepost > div > a > div.data > div.titlex")
          .text(),
        image: $(e)
          .find("div.animepost > div > a > div.content-thumb > img")
          .attr("src"),
        eps: $(e)
          .find("div.animepost > div > a > div.content-thumb > div.EPS > span")
          .text(),
        type: $(e)
          .find("div.animepost > div > a > div.content-thumb > div.type")
          .text(),
      });
    });
  } catch (error) {
    console.log(error);
  }
};

const fetchAllData = async (totalPages) => {
  for (let page = 1; page <= totalPages; page++) {
    await fetchData(page);
  }
};

const totalPagesToScrape = 15; // For example, scrape data from 5 pages

fetchAllData(totalPagesToScrape).then(() => {
  console.log("Data scraping completed!");
});

app.get("/pages/episode-terbaru/", (req, res) => {
  res.send(episodeTerbaru);
});

app.listen(port, () => console.log("Server is running"));
