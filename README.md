# RSS News Api

![](https://github.com/AntonioStipic/RssNewsAPI/blob/master/static/images/logo.png?raw=true)

Open source API for fetching short news and articles. Powered by NodeJS and AngularJS.

## Website

Link: [http://newsapi.xyz](http://newsapi.xyz/)

## Example request
> newsapi.xyz/news?appid={APPID}&category={CATEGORY}&limit={LIMIT}


## Example response
Example of JSON response that API returns

```json
[
   {
      "id": 16104,
      "title": "Trump treats the border like a natural disaster. He even dresses the part.",
      "description": "Trump has a uniform he wears to visit hurricanes and wildfires - and it says a lot that he wore it to the Mexico border.",
      "link": "{LINK}",
      "language": "en",
      "category": "latest",
      "time": 1547464873
   }
]
```

## Parameters
List of available parameters:

- Language
- Category
- Order
- Limit

## Language
List of available languages (Soon will new languages be added):

> en - English
>
> hr - Croatian

*By default language is set to* **en**.

## Category
List of available categories per language:

```json
{
   "en":[
      "latest",
      "top",
      "politics",
      "sports",
      "world",
      "business",
      "lifestyle",
      "entertainment",
      "technology",
      "health",
      "science"
   ],
   "hr":[
      "latest",
      "top",
      "news",
      "sports",
      "lifestyle",
      "technology"
   ]
}
```

*By default category is set to* **latest**.

## Order
Order parameter can be either "ASC" or "DESC". It is used to invert the order of the received news. By using "DESC" news will be listed from latest to oldest and by using "ASC" news are listed from oldest to newest.

*By default order is set to* **DESC**.

## Limit

Limit parameter is optional but **very recommended**.
Limit represents number of news that are fetched from API.

**By excluding limit parameter all news in the corresponding category and language will be fetched.**

## List of RSS feeds

```json
{
   "en":{
      "latest":[
         "http://rss.cnn.com/rss/cnn_latest.rss"
      ],
      "top":[
         "https://abcnews.go.com/abcnews/topstories",
         "http://rss.cnn.com/rss/edition.rss"
      ],
      "politics":[
         "http://feeds.washingtonpost.com/rss/politics",
         "https://abcnews.go.com/abcnews/politicsheadlines"
      ],
      "sports":[
         "http://feeds.washingtonpost.com/rss/sports",
         "http://rss.cnn.com/rss/edition_sport.rss",
         "http://feeds.bbci.co.uk/sport/rss.xml",
         "http://rss.nytimes.com/services/xml/rss/nyt/Sports.xml"
      ],
      "world":[
         "http://feeds.washingtonpost.com/rss/world",
         "https://abcnews.go.com/abcnews/worldnewsheadlines",
         "http://rss.cnn.com/rss/edition_world.rss",
         "http://feeds.bbci.co.uk/news/world/rss.xml",
         "http://rss.nytimes.com/services/xml/rss/nyt/World.xml"
      ],
      "business":[
         "http://feeds.washingtonpost.com/rss/business",
         "http://feeds.bbci.co.uk/news/business/rss.xml",
         "http://rss.nytimes.com/services/xml/rss/nyt/Business.xml",
         "http://rss.nytimes.com/services/xml/rss/nyt/Economy.xml"
      ],
      "lifestyle":[
         "http://feeds.washingtonpost.com/rss/lifestyle"
      ],
      "entertainment":[
         "http://feeds.washingtonpost.com/rss/entertainment",
         "http://rss.cnn.com/rss/edition_entertainment.rss",
         "http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml"
      ],
      "technology":[
         "https://abcnews.go.com/abcnews/technologyheadlines",
         "http://rss.cnn.com/rss/edition_technology.rss",
         "http://feeds.bbci.co.uk/news/technology/rss.xml",
         "http://rss.nytimes.com/services/xml/rss/nyt/Technology.xml"
      ],
      "health":[
         "https://abcnews.go.com/abcnews/healthheadlines",
         "http://rss.nytimes.com/services/xml/rss/nyt/Health.xml"
      ],
      "science":[
         "http://rss.cnn.com/rss/edition_space.rss",
         "http://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
         "http://rss.nytimes.com/services/xml/rss/nyt/Science.xml"
      ]
   },
   "hr":{
      "latest":[
         "http://www.24sata.hr/feeds/najnovije.xml",
         "https://www.vecernji.hr/feeds/latest",
         "https://www.index.hr/rss"
      ],
      "top":[
         "https://www.24sata.hr/feeds/aktualno.xml",
         "https://www.index.hr/rss/najcitanije"
      ],
      "news":[
         "https://www.24sata.hr/feeds/news.xml",
         "https://www.index.hr/rss/vijesti"
      ],
      "sports":[
         "http://www.24sata.hr/feeds/sport.xml",
         "https://www.index.hr/rss/sport"
      ],
      "lifestyle":[
         "http://www.24sata.hr/feeds/lifestyle.xml"
      ],
      "technology":[
         "http://www.24sata.hr/feeds/tech.xml"
      ]
   }
}
```

#### Made by: Antonio Stipić
