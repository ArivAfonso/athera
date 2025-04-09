# Define topic configurations
source_configs = {
    "tech": {
        "techcrunch": {
            "url": "https://techcrunch.com/",
            "title_suffix": " | TechCrunch",
        },
        "wired": {
            "url": "https://www.wired.com/",
            "title_suffix": " | WIRED",
            "sitemap_xml": "https://www.wired.com/sitemap.xml"
        },
        "gizmodo": {
            "url": "https://gizmodo.com/",
            "title_suffix": " | Gizmodo",
        },
        "theverge": {
            "url": "https://www.theverge.com/",
            "title_suffix": " - The Verge",
        },
        # "arstechnica": {
        #     "url": "https://arstechnica.com/",
        #     "title_suffix": " | Ars Technica",
        # },
        # "androidauthority": {
        #     "url": "https://www.androidauthority.com/",
        #     "title_suffix": " - Android Authority",
        # },
        "pcworld": {
            "url": "https://www.pcworld.com/",
            "title_suffix": " | PCWorld",
        },
        "engadget": {
            "url": "https://www.engadget.com/",
            "title_suffix": " | Engadget",
            "sitemap_xml": "https://www.engadget.com/sitemap.xml"
        },
        "macworld": {
            "url": "https://www.macworld.com/",
            "title_suffix": " | Macworld",
        },
        "slashdot": {
            "url": "https://slashdot.org/",
            "title_suffix": " - Slashdot",
        },
        "windowscentral": {
            "url": "https://www.windowscentral.com/",
            "title_suffix": " | Windows Central",
        },
        "techradar": {
            "url": "https://www.techradar.com/",
            "title_suffix": " | TechRadar",
        },
        "cnet": {
            "url": "https://www.cnet.com/",
            "title_suffix": " - CNET",
            "ignore_url_parts": ["https://www.cnet.com/#ftag="]
        },
    },
    "politics": {
        "politico": {
            "url": "https://www.politico.com/",
            "title_suffix": " - POLITICO",
        },
        "the-hill": {
            "url": "https://thehill.com/",
            "title_suffix": " | The Hill",
        },
        "vox": {
            "url": "https://www.vox.com/",
            "title_suffix": " - Vox",
        }
    },
    "music": {
        "billboard": {
            "url": "https://www.billboard.com/",
            "title_suffix": " | Billboard",
        },
        "pitchfork": {
            "url": "https://pitchfork.com/",
            "title_suffix": " | Pitchfork",
            "ignore_url_parts": ["https://pitchfork.com/reviews/"]
        }
    },
    "sports": {
        # "theathletic": {
        #     "url": "https://theathletic.com/",
        #     "title_suffix": " | The Athletic",
        # },
        "bleacherreport": {
            "url": "https://bleacherreport.com/",
            "title_suffix": " | Bleacher Report",
            "sitemap_xml": "https://bleacherreport.com/sitemaps"
        },
        "sportbible": {
            "url": "https://www.sportbible.com/",
            "title_suffix": " | SPORTbible",
        },
        "talksport": {
            "url": "https://talksport.com/",
            "title_suffix": " | talkSPORT",
            "ignore_url_parts": ["https://talksport.com/betting/"]
        },
        "therace": {
            "url": "https://the-race.com/",
            "title_suffix": " | The Race",
            "sitemap_xml": "https://www.the-race.com/sitemap-posts.xml",
            "ignore_url_parts": ["https://www.the-race.com/promoted/"]
        },
        "sportsillustrated": {
            "url": "https://www.si.com/",
            "title_suffix": " | Sports Illustrated",
            "sitemap_xml": "https://www.si.com/news-sitemap.xml"
        },
    },
    "cars": {
        # "autoexpress": {
        #     "url": "https://www.autoexpress.co.uk/",
        #     "title_suffix": " | Auto Express",
        # },
        # "motor1": {
        #     "url": "https://www.motor1.com/",
        #     "title_suffix": " | Motor1",
        # },
        # "motortrend": {
        #     "url": "https://www.motortrend.com/",
        #     "title_suffix": " | MotorTrend",
        #     "sitemap_xml": "https://www.motortrend.com/sitemap-article-news-2025.xml",
        #     "disable_outdated_check": True  # Disable the out-of-date check for motortrend
        # }
        
        "automotivenews": {
            "url": "https://www.autonews.com/",
            "title_suffix": " | Automotive News",
            "sitemap_xml": "https://www.autonews.com/arc/outboundfeeds/sitemap/latest/?outputType=xml"
        },
    },
    "gaming": {
        "polygon": {
            "url": "https://www.polygon.com/",
            "title_suffix": " - Polygon",
        },
        "kotaku": {
            "url": "https://kotaku.com/",
            "title_suffix": " | Kotaku",
        },
        "ign": {
            "url": "https://www.ign.com/",
            "title_suffix": " | IGN",
        }
    },
    "entertainment": {
        "indiewire": {
            "url": "https://www.indiewire.com/",
            "title_suffix": " | IndieWire",
        },
        "variety": {
            "url": "https://variety.com/",
            "title_suffix": " - Variety",
        },
        "empireonline": {
            "url": "https://www.empireonline.com/",
            "title_suffix": " | Empire",
            "sitemap_xml": "https://www.empireonline.com/sitemap_articles.xml?page=1"
        },
    },
    "business": {
        "theentrepreneur": {
            "url": "https://entrepreneur.com/",
            "title_suffix": " | Entrepreneur",
        },
        "businessinsider": {
            "url": "https://www.businessinsider.com/",
            "title_suffix": " - Business Insider",
        },
        "quartz": {
            "url": "https://qz.com/",
            "title_suffix": " - Quartz",
        },
        # "fastcompany": {
        #     "url": "https://www.fastcompany.com/",
        #     "title_suffix": " | Fast Company",
        #     "sitemap_xml": "https://www.fastcompany.com/sitemap.xml",
        #     "sitemap_xml_number": 1,
        #     "ignore_urls": ["https://www.fastcompany.com"]
        # },
    },
    "finance": {
        "thedailyupside": {
            "url": "https://www.thedailyupside.com/",
            "title_suffix": " | The Daily Upside",
        },
        "fortune": {
            "url": "https://fortune.com/",
            "title_suffix": " - Fortune",
        },
        "financialtimes": {
            "url": "https://www.ft.com/",
            "title_suffix": " | Financial Times",
        },
        "theeconomist": {
            "url": "https://www.economist.com/",
            "title_suffix": " | The Economist",
            "sitemap_xml": "https://www.economist.com/googlenews.xml"
        },
    },
    "general": {
        "forbes": {
            "url": "https://www.forbes.com/",
            "title_suffix": " - Forbes",
            "sitemap_xml": "https://www.forbes.com/news_sitemap.xml"
        },
        "time": {
            "url": "https://time.com/",
            "title_suffix": " | Time",
            "sitemap_xml": "https://time.com/news-sitemap.xml"
        },
        "aljazeera": {
            "url": "https://www.aljazeera.com/",
            "title_suffix": " | Al Jazeera",
            "sitemap_xml": "https://www.aljazeera.com/sitemap.xml"
        },
        "npr": {
            "url": "https://www.npr.org/",
            "title_suffix": " | NPR",
        },
        
    },
    "travel": {
        "atlasobscura": {
            "url": "https://www.atlasobscura.com/",
            "title_suffix": " - Atlas Obscura",
        },
        # "lonelyplanet": {
        #     "url": "https://www.lonelyplanet.com/",
        #     "title_suffix": " - Lonely Planet",
        # },
        # "cntraveller": {
        #     "url": "https://www.cntraveller.com/",
        #     "title_suffix": " | CN Traveller",
        # }
    },
    "fashion": {
        "hypebeast": {
            "url": "https://hypebeast.com/",
            "title_suffix": " | HYPEBEAST",
            "sitemap_xml": "https://hypebeast.com/sitemap.xml"
        },
        "vogue": {
            "url": "https://www.vogue.com/",
            "title_suffix": " - Vogue",
        },
        "fashionista": {
            "url": "https://fashionista.com/",
            "title_suffix": " | Fashionista",
        }
    },
    # "literature": {
    #     "lithub": {
    #         "url": "https://lithub.com/",
    #         "title_suffix": " | Literary Hub",
    #     },
    # },
    "science": {
        "sciencenews": {
            "url": "https://www.sciencenews.org/",
            "title_suffix": " | Science News",
        },
        "discovermagazine": {
            "url": "https://www.discovermagazine.com/",
            "title_suffix": " | Discover Magazine",
            "sitemap_xml": "https://www.discovermagazine.com/sitemap/article/recent/1.xml"
        },
        "undark": {
            "url": "https://undark.org/",
            "title_suffix": " | Undark",
        },
    },
    # "architecture": {
    #     "elledecor": {
    #         "url": "https://www.elledecor.com/",
    #         "title_suffix": " - ELLE Decor",
    #     },
    # },
    "international": {
        "aljazeera": {
            "url": "https://www.aljazeera.com/",
            "title_suffix": " | Al Jazeera",
            "include_url_parts": ["/news/"],
            "country": "Qatar"
        },
        "theaustralian": {
            "url": "https://www.theaustralian.com.au/",
            "title_suffix": " | The Australian",
            "sitemap_xml": "https://www.theaustralian.com.au/sitemap.xml",
            "country": "Australia"
        },
        "thechosundaily": {
            "url": "https://www.chosun.com/english/",
            "title_suffix": " | The Chosun Daily",
            "include_url_parts": ["/english/"],
            "country": "South Korea"
        },
        "ansa": {
            "url": "https://www.ansa.it/english/",
            "title_suffix": " | Ansa.it",
            "include_url_parts": ["/english/news/"],
            "country": "Italy"
        },
        "thestraitstimes": {
            "url": "https://www.straitstimes.com/",
            "title_suffix": " | The Straits Times",
            "include_url_parts": ["/singapore/", "/asia/"],
            "country": "Singapore"
        },
        "france24": {
            "url": "https://www.france24.com/en/",
            "title_suffix": " | France 24",
            "include_url_parts": ["/en/"],
            "country": "France"
        },
        "theriotimes": {
            "url": "https://riotimesonline.com/",
            "title_suffix": " | The Rio Times",
            "country": "Brazil"
        },
        "dw": {
            "url": "https://www.dw.com/",
            "title_suffix": " | DW",
            "sitemap_xml": "https://www.dw.com/en/news-sitemap.xml",
            "country": "Germany"
        },
        "southchinamorningpost": {
            "url": "https://www.scmp.com/",
            "title_suffix": " | South China Morning Post",
            "country": "Hong Kong"
        },
        "thewalrus": {
            "url": "https://thewalrus.ca/",
            "title_suffix": " | The Walrus",
            "country": "Canada"
        },
        "latimes": {
            "url": "https://www.latimes.com/",
            "title_suffix": " - Los Angeles Times",
            "sitemap_xml": "https://www.latimes.com/sitemap-latest.xml",
            "include_urls": ["/story/"],
            "country": "United States"
        },
        "japantoday": {
            "url": "https://japantoday.com/",
            "title_suffix": " | Japan Today",
            "country": "Japan"
        },
        "thejapannews": {
            "url": "https://japannews.yomiuri.co.jp",
            "title_suffix": " | The Japan News",
            "sitemap_xml": "https://japannews.yomiuri.co.jp/sitemap-news.xml",
            "country": "Japan"
        },
        "thekoreatimes": {
            "url": "https://www.koreatimes.co.kr/",
            "title_suffix": " | The Kore Times",
            "sitemap_xml": "https://www.koreatimes.co.kr/site_map/news/news.xml",
            "country": "South Korea"
        },
    },
    "cooking": {
        "bonappetit": {
            "url": "https://www.bonappetit.com/",
            "title_suffix": " | Bon Appétit",
        },
    },
}