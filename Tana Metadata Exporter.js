{
  "translatorID": "dda092d2-a257-46af-b9a3-2f04a55cb04f",
  "translatorType": 2,
  "label": "Tana Metadata Export",
  "creator": "Joshua Hall based upon Stian Håklev, Joel Chan, and Lukas Kawerau's work",
  "target": "md",
  "minVersion": "2.0",
  "maxVersion": "",
  "priority": 200,
  "inRepository": false,
  "lastUpdated": "2023-03-31 - 10:20"
}

// NOTE: This is explicitly designed around the Tanarian Brain by Lukas Kawerau.
// Zotero schema: https://api.zotero.org/schema

function doExport() {
  // Functions to convert date to Tana format
  // List of months
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Application of the ordinal number suffix
  const nth = (d) => {
    if (d > 3 && d < 21) {
      return "th";
    }
    switch (d % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  // Return the Tana formatted date
  const formatDate = (dateJSON) => {
    // Generate a Tana friendly formatted date
    // Falls back to Jan 1, 2100 for any missing components of the date
    const year = dateJSON["year"] || "2100";
    const month = months[dateJSON["month"]] || months[0];
    const day = dateJSON["day"] || 1;
    const nthStr = nth(day);
    return link(`${month} ${day}${nthStr}, ${year}`);
  };
  // ---


  // Additional helper functions for consistent formatting
  // Return a "[[link]]" value
  const link = (name) => {
    return `[[${name}]]`;
  };

  // Return a " #[[tag]]" value
  const tag = (name) => {
    return ` #[[${name}]]`;
  };

  // Return a "field:: " value
  const field = (name) => {
    return `${name}:: `;
  };

  // Return an "[external](https://link.com)" value
  const extLink = (name, url) => {
    return `[${name}](${url})`;
  };

  // Return the "https://doi.org/doi/link" value
  const doiLink = (id) => {
    return `https://doi.org/${id}`
  };

  // Return the "Title Cased" value
  // This is a very simply version of the algorithm, and can be improved
  const titleCase = (string) => {
    var sentence = string.toLowerCase().split(" ");
    for (var i = 0; i < sentence.length; i++) {
      sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
    }
    return sentence.join(" ");
  };

  // Return list of valid creators
  const validatedContributors = (creators, includedTypes) => {
    const list = [];
    for (creator in creators) {
      if ((includedTypes !== undefined && includedTypes.indexOf(creators[creator].creatorType.toLowerCase()) !== -1) ||
        includedTypes === undefined) {
        if (creators[creator].firstName !== undefined && creators[creator].lastName !== undefined) {
          // Use the full name of the creator. Should be the most common situation
          list.push(`${creators[creator].firstName} ${creators[creator].lastName}`);
        } else if (creators[creator].lastName !== undefined) {
          // Only use the last name
          list.push(`${creators[creator].lastName}`);
        }
      }
    }
    return list;
  };
  // ---


  // Various constants used throughout
  // Constants for prepending indents consistently
  const tab = [
    "- ",
    "  - ",
    "    - ",
    "      - ",
    "        - ",
    "          - ",
    "            - ",
    "              - ",
    "                - ",
    "                  - "
  ];


  // In Tana, you can explicitly reference a node in your graph by appending a carrot and the ID from the node.
  // 1. Get the node link in your Tana graph. https://app.tana.inc?nodeid=p_7iFOOsX3
  // 2. Append the ID with a carrot to the node name (e.g., "source") inside the quotes
  //    So, "source" would become "source^p_7iFOOsX3" in this example
  //
  // This ensures you're referencing the correct node in Tana, and avoids quite a bit of duplication.
  //   This is particularly important when working across multiple graphs. I suggest you take a few moments
  //   and update all of the tags, statuses, and fields below. I suspect it'll save you headaches later.

  // Constants describing source type tags
  const sourceTag = tag("source");
  const journalArticleTag = tag("journal article");
  const authorTag = tag("author");
  const journalPublicationTag = tag("journal (publication)");
  const topicTag = tag("topic");
  const bookTag = tag("book");
  const organizationTag = tag("organization");
  const chapterTag = tag("chapter");
  const videoTag = tag("video");
  const hostTag = tag("host");
  const publicationTag = tag("publication");
  const podcastEpisodeTag = tag("podcast episode");
  const podcastTag = tag("podcast");
  const directorTag = tag("director");
  const filmTag = tag("film");
  const personTag = tag("person");
  const presentationTag = tag("presentation");
  const newspaperArticleTag = tag("newspaper article");
  const blogPostTag = tag("blog post");
  const artworkTag = tag("artwork");
  const artistTag = tag("artist");
  const reportTag = tag("report");
  const billTag = tag("bill");
  const caseTag = tag("case");
  const letterTag = tag("letter");
  const instantMessageTag = tag("instant message");
  const mapTag = tag("map");
  const emailTag = tag("email");
  const patentTag = tag("patent");
  const encyclopeidaArticleTag = tag("encyclopedia article");
  const interviewTag = tag("interview");
  const preprintTag = tag("preprint");
  const radioBroadcastTag = tag("radio broadcast");
  const tvBroadcastTag = tag("tv broadcast");
  const statuteTag = tag("statute");
  const conferencePaperTag = tag("conference paper");
  const conferenceTag = tag("conference");
  const countryTag = tag("country");

  // Constants describing source status options
  const toReadStatus = link("📚 To Read");
  const toWatchStatus = link("🎞️ To Watch");
  const toListenStatus = link("💿 To Listen");
  const readingStatus = link("📖 Reading");
  const watchingStatus = link("📽️ Watching");
  const listeningStatus = link("🎧 Listening");
  const readStatus = link("📗 Read");
  const watchedStatus = link("📼 Watched");
  const listenedStatus = link("🔇 Listened");

  // Constants for the fields used
  const titleField = field("Title");
  const sourceStatusField = field("Source Status");
  const citationKeyField = field("Citation Key");
  const authorField = field("Author(s)");
  const publicationDateField = field("Publication Date");
  const zoteroLinkField = field("Zotero Link");
  const journalField = field("Journal");
  const volumeField = field("Volume");
  const issueField = field("Issue");
  const urlField = field("URL");
  const doiField = field("DOI");
  const topicField = field("Topic(s)");
  const publisherField = field("Publisher");
  const bookField = field("Book");
  const hostField = field("Host(s)");
  const publicationField = field("Publication");
  const episodeNumberField = field("Episode Number");
  const podcastField = field("Podcast");
  const directorField = field("Director");
  const genreField = field("Genre");
  const languageField = field("Language");
  const dateField = field("Date");
  const presenterField = field("Presenter");
  const artistField = field("Artist");
  const artworkMediumField = field("Artwork Medium");
  const artworkSizeField = field("Artwork Size");
  const instiutionField = field("Institution");
  const billSponsorField = field("Bill Sponsor");
  const billNumberField = field("Bill Number");
  const legislativeBodyField = field("Legislative Body");
  const legislativeSessionField = field("Legislative Session");
  const courtField = field("Court");
  const dateDecidedField = field("Date Decided");
  const cartographerField = field("Cartographer");
  const mapTypeField = field("Map Type");
  const mapScaleField = field("Map Scale");
  const locationField = field("Location");
  const conferenceField = field("Conference");
  const programTitleField = field("Program Title");
  const tvNetworkField = field("TV Network");
  const radioNetworkField = field("Radio Network");
  const intervieweeField = field("Interview with");
  const mediumField = field("Medium");
  const encyclopediaTitleField = field("Encyclopedia Title");
  const countryField = field("Country");
  const patentNumberField = field("Patent Number");
  const inventorField = field("Inventor");

  // Zotero tags to ignore when importing topics
  const ignoredTopics = [
    "_tablet",
    "_tablet_modified"
  ];
  // ---


  // Functions to write content for each field included in a specific section of content
  const writeBase = (title = "Unknown title", type = sourceTag, status = toReadStatus) => {
    // - Foo bar #[[source]]
    //   - Title:: Foo bar
    //   - Source Status:: [[📚 To Read]]
    Zotero.write(tab[0] + title + type + "\n");
    writeTitle(title);
    writeSourceStatus(status);
  };

  // Write the title
  const writeTitle = (title = "Unknown title", t = 1) => {
    // - Title:: Foo bar
    Zotero.write(tab[t] + titleField + title + "\n");
  };

  // Write the source status
  const writeSourceStatus = (status = toReadStatus, t = 1) => {
    // - Source Status:: [[📚 To Read]]
    Zotero.write(tab[t] + sourceStatusField + status + "\n");
  };

  // Write the citekey
  const writeCitationKey = (citekey, t = 1) => {
    // - Citation Key:: @foo2018bar
    if (citekey !== undefined && citekey !== "") {
      Zotero.write(tab[t] + citationKeyField + "@" + citekey  + "\n");
    }
  };

  // Write Zotero link
  const writeZoteroLink = (key, library = 0, t = 1) => {
    // - Zotero Link: zotero://select/items/foo_bar
    if (key !== undefined && key !== "") {
      // const library_id = library ? library : 0;
      const itemLink = `zotero://select/items/${library}_${key}`;
      Zotero.write(tab[t] + zoteroLinkField + itemLink + "\n");
    }
  };

  // Write the journal title
  const writeJournalTitle = (journalTitle, t = 1) => {
    // - Journal:: Foo Bar #[[journal (publication)]]
    if (journalTitle !== undefined && journalTitle !== "") {
      Zotero.write(tab[t] + journalField + journalTitle + journalPublicationTag + "\n");
    }
  };

  // Write the volume information
  const writeVolume = (volume, t = 1) => {
    // - Volume:: 88
    if (volume !== undefined && volume !== "") {
      Zotero.write(tab[t] + volumeField + volume + "\n");
    }
  };

  // Write the issue information
  const writeIssue = (issue, t = 1) => {
    // - Issue:: 88
    if (issue !== undefined && issue !== "") {
      Zotero.write(tab[t] + issueField + item.issue + "\n");
    }
  };

  // Write the publication date
  const writePublicationDate = (date, t = 1) => {
    // - Publication Date:: [[March 15th, 2020]]
    if (date !== undefined && date !== "") {
      Zotero.write(tab[t] + publicationDateField + formatDate(Zotero.Utilities.strToDate(date)) + "\n");
    }
  };

  // Write the date
  const writeDate = (date, t = 1) => {
    // - Date:: [[March 15th, 2020]]
    if (date !== undefined && date !== "") {
      Zotero.write(tab[t] + dateField + formatDate(Zotero.Utilities.strToDate(date)) + "\n");
    }
  };

  // Write the list of authors
  const writeAuthors = (creators, t = 1) => {
    // - Author(s)::
    //   - Dr. Foo #[[author]]
    //   - Dr. Foo Bar #[[author]]

    // Filter for included types only
    const includedTypes = [
      "author",
      "contributor",
      "editor",
      "translator",
      "seriesEditor",
      "bookAuthor",
      "reviewedAuthor"
    ];

    if (creators !== undefined) {
      // Find list of all of the creators associated with this item
      names = validatedContributors(creators, includedTypes);

      if (names.length > 0) {
        // Start by creating the type field parent
        Zotero.write(tab[t] + authorField + "\n");
        for (name in names) {
          Zotero.write(tab[t + 1] + names[name] + authorTag + "\n");
        }
      }
    }
  };

  // Write the list of hosts
  const writeHosts = (creators, t = 1) => {
    // - Host(s)::
    //   - Dr. Foo #[[host]]
    //   - Dr. Foo Bar #[[host]]

    // Filter for included types only
    const includedTypes = [
      "director",
      "contributor",
      "castMember",
      "podcaster",
      "guest",
      "interviewer"
    ];

    if (creators !== undefined) {
      // Find list of all of the creators associated with this item
      names = validatedContributors(creators, includedTypes);

      if (names.length > 0) {
        // Start by creating the type field parent
        Zotero.write(tab[t] + hostField + "\n");
        for (name in names) {
          Zotero.write(tab[t + 1] + names[name] + hostTag + "\n");
        }
      }
    }
  };

  // Write the list of interviewees
  const writeInterviewees = (creators, t = 1) => {
    // - Interview with::
    //   - Dr. Foo #[[person]]
    //   - Dr. Foo Bar #[[person]]

    // Filter for included types only
    const includedTypes = [
      "interviewee"
    ];

    if (creators !== undefined) {
      // Find list of all of the creators associated with this item
      names = validatedContributors(creators, includedTypes);

      if (names.length > 0) {
        // Start by creating the type field parent
        Zotero.write(tab[t] + intervieweeField + "\n");
        for (name in names) {
          Zotero.write(tab[t + 1] + names[name] + personTag + "\n");
        }
      }
    }
  };

  // Write the list of directors
  const writeDirectors = (creators, t = 1) => {
    // - Director::
    //   - Dr. Foo #[[director]]
    //   - Dr. Foo Bar #[[director]]

    // Filter for included types only
    const includedTypes = [
      "director"
    ];

    if (creators !== undefined) {
      // Find list of all of the creators associated with this item
      names = validatedContributors(creators, includedTypes);

      if (names.length > 0) {
        // Start by creating the type field parent
        Zotero.write(tab[t] + directorField + "\n");
        for (name in names) {
          Zotero.write(tab[t + 1] + names[name] + directorTag + "\n");
        }
      }
    }
  };

  // Write the list of presenters
  const writePresenters = (creators, t = 1) => {
    // - Presenter::
    //   - Dr. Foo #[[person]]
    //   - Dr. Foo Bar #[[person]]

    // Filter for included types only
    const includedTypes = [
      "presenter",
      "contributor"
    ];

    if (creators !== undefined) {
      // Find list of all of the creators associated with this item
      names = validatedContributors(creators, includedTypes);

      if (names.length > 0) {
        // Start by creating the type field parent
        Zotero.write(tab[t] + presenterField + "\n");
        for (name in names) {
          Zotero.write(tab[t + 1] + names[name] + personTag + "\n");
        }
      }
    }
  };

  // Write the list of artists
  const writeArtists = (creators, t = 1) => {
    // - Artist::
    //   - Foo #[[artist]]
    //   - Bar #[[artist]]

    // Filter for included types only
    const includedTypes = [
      "artist",
      "contributor"
    ];

    if (creators !== undefined) {
      // Find list of all of the creators associated with this item
      names = validatedContributors(creators, includedTypes);

      if (names.length > 0) {
        // Start by creating the type field parent
        Zotero.write(tab[t] + artistField + "\n");
        for (name in names) {
          Zotero.write(tab[t + 1] + names[name] + artistTag + "\n");
        }
      }
    }
  };

  // Write the list of bill sponsors
  const writeBillSponsors = (creators, t = 1) => {
    // - Bill Sponsor::
    //   - Foo #[[person]]
    //   - Bar #[[person]]

    // Filter for included types only
    const includedTypes = [
      "sponsor",
      "cosponsor",
      "contributor"
    ];

    if (creators !== undefined) {
      // Find list of all of the creators associated with this item
      names = validatedContributors(creators, includedTypes);

      if (names.length > 0) {
        // Start by creating the type field parent
        Zotero.write(tab[t] + billSponsorField + "\n");
        for (name in names) {
          Zotero.write(tab[t + 1] + names[name] + personTag + "\n");
        }
      }
    }
  };

  // Write the list of cartographers
  const writeCartographers = (creators, t = 1) => {
    // - Cartographer::
    //   - Foo #[[person]]
    //   - Bar #[[person]]

    // Filter for included types only
    const includedTypes = [
      "cartographer",
      "seriesEditor",
      "contributor"
    ];

    if (creators !== undefined) {
      // Find list of all of the creators associated with this item
      names = validatedContributors(creators, includedTypes);

      if (names.length > 0) {
        // Start by creating the type field parent
        Zotero.write(tab[t] + cartographerField + "\n");
        for (name in names) {
          Zotero.write(tab[t + 1] + names[name] + personTag + "\n");
        }
      }
    }
  };

  // Write the list of inventors
  const writeInventors = (creators, t = 1) => {
    // - Inventor::
    //   - Foo #[[person]]
    //   - Bar #[[person]]

    // Filter for included types only
    const includedTypes = [
      "inventor",
      "contributor"
    ];

    if (creators !== undefined) {
      // Find list of all of the creators associated with this item
      names = validatedContributors(creators, includedTypes);

      if (names.length > 0) {
        // Start by creating the type field parent
        Zotero.write(tab[t] + inventorField + "\n");
        for (name in names) {
          Zotero.write(tab[t + 1] + names[name] + personTag + "\n");
        }
      }
    }
  };

  // Write the item URL
  const writeURL = (url, t = 1) => {
    // - URL:: https://foo.bar
    if (url !== undefined && url !== "") {
      Zotero.write(tab[t] + urlField + url + "\n");
    }
  };

  // Write the DOI link
  const writeDOI = (doi, t = 1) => {
    // - DOI:: https://doi.org/foo/bar
    if (doi !== undefined && doi !== "") {
      Zotero.write(tab[t] + doiField + doiLink(doi) + "\n");
    }
  };

  // Write tags as topics in Tana
  const writeTags = (tags, t = 1) => {
    // - Topic(s)::
    //   - Foo Bar #[[topic]]
    //   - Woo #[[topic]]
    if (tags !== undefined) {
      // Start by creating the topic field parent
      Zotero.write(tab[t] + topicField + "\n");

      // Walk through the available tags
      for (topic in tags) {
        // Drop any tags on the ignore list
        if (ignoredTopics.indexOf(tags[topic].tag.toLowerCase()) === -1) {
          Zotero.write(tab[t + 1] + titleCase(tags[topic].tag) + topicTag + "\n");
        }
      }
    }
  };

  // Write the publisher
  const writePublisher = (publisher, t = 1) => {
    // - Publisher:: Foo Bar #[[organization]]
    if (publisher !== undefined && publisher !== "") {
      Zotero.write(tab[t] + publisherField + publisher + organizationTag + "\n");
    }
  };

  // Write the book field. This is used to reference a parent book object
  const writeBook = (title, authors, tags, t = 1) => {
    if (title !== undefined && title !== "") {
      // Start by creating the book field parent
      Zotero.write(tab[t] + bookField + "\n");

      // Add some critical information about the book
      Zotero.write(tab[t + 1] + title + bookTag + "\n");
      Zotero.write(tab[t + 2] + titleField + title + "\n");
      Zotero.write(tab[t + 2] + sourceStatusField + toReadStatus + "\n");
      writeAuthors(authors, t + 2);
      writeTags(tags, t + 2);
    }
  };

  // Write the publication title
  const writePublication = (pubTitle, t = 1) => {
    // - Journal:: Foo Bar #[[journal (publication)]]
    if (pubTitle !== undefined && pubTitle !== "") {
      Zotero.write(tab[t] + publicationField + pubTitle + publicationTag + "\n");
    }
  };

  // Write the episode number
  const writeEpisodeNumber = (episode, t = 1) => {
    // - Episode Number:: 88
    if (episode !== undefined && episode !== "") {
      Zotero.write(tab[t] + episodeNumberField + episode + "\n");
    }
  };

  // Write the podcast information
  const writePodcast = (podcast, t = 1) => {
    // - Podcast:: Foo Bar #[[podcast]]
    if (podcast !== undefined && podcast !== "") {
      Zotero.write(tab[t] + podcastField + podcast + podcastTag + "\n");
    }
  };

  // Write the genre
  const writeGenre = (genre, t = 1) => {
    // - Genre:: Foo Bar
    if (genre !== undefined && genre !== "") {
      Zotero.write(tab[t] + genreField + genre + "\n");
    }
  };

  // Write the language
  const writeLanguage = (language, t = 1) => {
    // - Language:: Foo Bar
    if (language !== undefined && language !== "") {
      Zotero.write(tab[t] + languageField + language + "\n");
    }
  };

  // Write the artwork medium
  const writeArtworkMedium = (medium, t = 1) => {
    // - Artwork Medium:: Foo Bar
    if (medium !== undefined && medium !== "") {
      Zotero.write(tab[t] + artworkMediumField + medium + "\n");
    }
  };

  // Write the artwork size
  const writeArtworkSize = (size, t = 1) => {
    // - Artwork Size:: Foo x Bar
    if (size !== undefined && size !== "") {
      Zotero.write(tab[t] + artworkSizeField + size + "\n");
    }
  };

  // Write the institution
  const writeInstitution = (institution, t = 1) => {
    // - Institution:: Foo Bar #[[organization]]
    if (institution !== undefined && institution !== "") {
      Zotero.write(tab[t] + instiutionField + institution + organizationTag + "\n");
    }
  };

  // Write the bill number
  const writeBillNumber = (billNumber, t = 1) => {
    // - Bill Number:: Foo Bar
    if (billNumber !== undefined && billNumber !== "") {
      Zotero.write(tab[t] + billNumberField + billNumber + "\n");
    }
  };

  // Write the legislative body
  const writeLegislativeBody = (legislativeBody, t = 1) => {
    // - Legislative Body:: Foo Bar #[[organization]]
    if (legislativeBody !== undefined && legislativeBody !== "") {
      Zotero.write(tab[t] + legislativeBodyField + legislativeBody + organizationTag + "\n");
    }
  };

  // Write the legislative session
  const writeLegislativeSession = (session, t = 1) => {
    // - Legislative Session:: Foo Bar
    if (session !== undefined && session !== "") {
      Zotero.write(tab[t] + legislativeSessionField + session + "\n");
    }
  };

  // Write the court
  const writeCourt = (court, t = 1) => {
    // - Court:: Foo Bar
    if (court !== undefined && court !== "") {
      Zotero.write(tab[t] + courtField + court + "\n");
    }
  };

  // Write the date decided
  const writeDateDecided = (date, t = 1) => {
    // - Date Decided:: [[March 15th, 2020]]
    if (date !== undefined && date !== "") {
      Zotero.write(tab[t] + dateDecidedField + formatDate(Zotero.Utilities.strToDate(date)) + "\n");
    }
  };

  // Write the map type
  const writeMapType = (type, t = 1) => {
    // - Map Type:: Foo Bar
    if (type !== undefined && type !== "") {
      Zotero.write(tab[t] + mapTypeField + type + "\n");
    }
  };

  // Write the map scale
  const writeMapScale = (scale, t = 1) => {
    // - Map Scale:: Foo Bar
    if (scale !== undefined && scale !== "") {
      Zotero.write(tab[t] + mapScaleField + scale + "\n");
    }
  };

  // Write the location
  const writeLocation = (location, t = 1) => {
    // - Location:: Foo Bar
    if (location !== undefined && location !== "") {
      Zotero.write(tab[t] + locationField + location + "\n");
    }
  };

  // Write the conference name
  const writeConference = (conference, t = 1) => {
    // - Conference:: Foo Bar
    if (conference !== undefined && conference !== "") {
      Zotero.write(tab[t] + conferenceField + conference + conferenceTag + "\n");
    }
  };
  
  // Write the program title
  const writeProgramTitle = (title, t = 1) => {
    // - Program Title:: Foo Bar
    if (title !== undefined && title !== "") {
      Zotero.write(tab[t] + programTitleField + title + "\n");
    }
  };

  // Write the TV network
  const writeTvNetwork = (network, t = 1) => {
    // - TV Network:: Foo Bar
    if (network !== undefined && network !== "") {
      Zotero.write(tab[t] + tvNetworkField + network + "\n");
    }
  };

  // Write the radio network
  const writeRadioNetwork = (network, t = 1) => {
    // - Radio Network:: Foo Bar
    if (network !== undefined && network !== "") {
      Zotero.write(tab[t] + radioNetworkField + network + "\n");
    }
  };

  // Write the medium
  const writeMedium = (medium, t = 1) => {
    // - Medium:: Foo Bar
    if (medium !== undefined && medium !== "") {
      Zotero.write(tab[t] + mediumField + medium + "\n");
    }
  };

  // Write the encyclopedia title
  const writeEncyclopediaTitle = (title, t = 1) => {
    // - Encyclopedia Title:: Foo Bar
    if (title !== undefined && title !== "") {
      Zotero.write(tab[t] + encyclopediaTitleField + title + "\n");
    }
  };

  // Write the country
  const writeCountry = (country, t = 1) => {
    // - Country:: Foo Bar
    if (country !== undefined && country !== "") {
      Zotero.write(tab[t] + countryField + country + countryTag + "\n");
    }
  };

  // Write the patent number
  const writePatentNumber = (patent, t = 1) => {
    // - Patent Number:: Foo Bar
    if (patent !== undefined && patent !== "") {
      Zotero.write(tab[t] + patentNumberField + patent + "\n");
    }
  };
  // ---


  // Finally, write everything out based upon the type
  // Create the Tana paste indicator line at the top
  Zotero.write("%%tana%%\n");

  // Main item variable we'll step through
  var item;

  // Step through all of the items we are exporting
  while (item = Zotero.nextItem()) {
    // Write content dependent upon the specific item type
    // Always start with writeBase()
    if (item.itemType !== undefined) {
      switch(item.itemType) {
        case "journalArticle":
          writeBase(item.title, journalArticleTag, toReadStatus);
          writeCitationKey(item.citationKey);
          writeZoteroLink(item.key, item.libraryID);
          writeAuthors(item.creators);
          writeJournalTitle(item.publicationTitle);
          writePublicationDate(item.date);
          writeVolume(item.volume);
          writeIssue(item.issue);
          writeURL(item.url);
          writeDOI(item.DOI);
          writeTags(item.tags);
          break;
        case "thesis":
        case "book":
          writeBase(item.title, bookTag, toReadStatus);
          writeCitationKey(item.citationKey);
          writeZoteroLink(item.key, item.libraryID);
          writeAuthors(item.creators);
          writeURL(item.url);
          writeTags(item.tags);
          writePublisher(item.publisher);
          break;
        case "bookSection":
          writeBase(item.title, chapterTag, toReadStatus);
          writeCitationKey(item.citationKey);
          writeZoteroLink(item.key, item.libraryID);
          writeTags(item.tags);
          writeBook(item.bookTitle, item.creators, item.tags);
          break;
        case "videoRecording":
          writeBase(item.title, videoTag, toWatchStatus);
          writeCitationKey(item.citationKey);
          writeZoteroLink(item.key, item.libraryID);
          writeHosts(item.creators);
          writePublication(item.libraryCatalog);
          writeURL(item.url);
          writeTags(item.tags);
          break;
        case "podcast":
        case "audioRecording":
          writeBase(item.title, podcastEpisodeTag, toListenStatus);
          writeCitationKey(item.citationKey);
          writeZoteroLink(item.key, item.libraryID);
          writeHosts(item.creators);
          writeEpisodeNumber(item.episodeNumber);
          writePodcast(item.seriesTitle);
          writeTags(item.tags);
          writeURL(item.url);
          break;
        case "film":
          writeBase(item.title, filmTag, toWatchStatus);
          writeCitationKey(item.citationKey);
          writeZoteroLink(item.key, item.libraryID);
          writeDirectors(item.creators);
          writeTags(item.tags);
          writeGenre(item.genre);
          writeLanguage(item.language);
          break;
        case "presentation":
          writeBase(item.title, presentationTag, toWatchStatus);
          writeCitationKey(item.citationKey);
          writeZoteroLink(item.key, item.libraryID);
          writeTags(item.tags);
          writeDate(item.date);
          writePresenters(item.creators);
          break;
        case "newspaperArticle":
        case "magazineArticle":
          writeBase(item.title, newspaperArticleTag, toReadStatus);
          writeCitationKey(item.citationKey);
          writeZoteroLink(item.key, item.libraryID);
          writeTags(item.tags);
          writeAuthors(item.creators);
          writePublicationDate(item.date);
          break
        case "blogPost":
        case "webpage":
        case "forumPost":
          writeBase(item.title, blogPostTag, toReadStatus);
          writeCitationKey(item.citationKey);
          writeZoteroLink(item.key, item.libraryID);
          writeTags(item.tags);
          writeAuthors(item.creators);
          writePublicationDate(item.date);
          writeURL(item.url);
          break;
        case "artwork":
          writeBase(item.title, newspaperArticleTag, toReadStatus);
          writeCitationKey(item.citationKey);
          writeZoteroLink(item.key, item.libraryID);
          writeTags(item.tags);
          writeArtists(item.creators);
          writeArtworkMedium(item.artworkMedium);
          writeArtworkSize(item.artworkSize);
          writeDate(item.date);
          break;
        case "report":
          writeBase(item.title, reportTag, toReadStatus);
          writeCitationKey(item.citationKey);
          writeZoteroLink(item.key, item.libraryID);
          writeTags(item.tags);
          writePublicationDate(item.date);
          writeInstitution(item.institution);
          break;
        case "bill":
          writeBase(item.title, billTag, toReadStatus);
          writeCitationKey(item.citationKey);
          writeZoteroLink(item.key, item.libraryID);
          writeTags(item.tags);
          writeBillSponsors(item.creators);
          writeBillNumber(item.billNumber);
          writeLegislativeBody(item.legislativeBody);
          writeLegislativeSession(item.session);
          writeDate(item.date);
          break;
        case "case":
        case "hearing":
          writeBase(item.caseName, caseTag, toReadStatus);
          writeCitationKey(item.citationKey);
          writeZoteroLink(item.key, item.libraryID);
          writeTags(item.tags);
          writeCourt(item.court);
          writeDateDecided(item.dateDecided);
          writeURL(item.url);
          break;
        case "letter":
          writeBase(item.title, letterTag, toReadStatus);
          writeCitationKey(item.citationKey);
          writeZoteroLink(item.key, item.libraryID);
          writeTags(item.tags);
          writeAuthors(item.creators);
          writeDate(item.date);
          break;
        case "document":
        case "manuscript":
        case "attachment":
        case "annotation":
        case "computerProgram":
          writeBase(item.title, letterTag, toReadStatus);
          writeCitationKey(item.citationKey);
          writeZoteroLink(item.key, item.libraryID);
          writeTags(item.tags);
          writePublisher(item.publisher);
          writeURL(item.url);
          break;
        case "instantMessage":
          writeBase(item.title, instantMessageTag, toReadStatus);
          writeCitationKey(item.citationKey);
          writeZoteroLink(item.key, item.libraryID);
          writeTags(item.tags);
          writeAuthors(item.creators);
          writeDate(item.date);
          break;
        case "email":
          writeBase(item.title, emailTag, toReadStatus);
          writeCitationKey(item.citationKey);
          writeZoteroLink(item.key, item.libraryID);
          writeTags(item.tags);
          writeAuthors(item.creators);
          writeDate(item.date);
          break;
        case "map":
          writeBase(item.title, mapTag, toReadStatus);
          writeCitationKey(item.citationKey);
          writeZoteroLink(item.key, item.libraryID);
          writeTags(item.tags);
          writeCartographers(item.creators);
          writeMapType(item.mapType);
          writeMapScale(item.scale);
          writeDate(item.date);
          writeLocation(item.place);
          break;
        case "patent":
          writeBase(item.title, patentTag, toReadStatus);
          writeCitationKey(item.citationKey);
          writeZoteroLink(item.key, item.libraryID);
          writeTags(item.tags);
          writeLocation(item.place);
          writeInventors(item.creators);
          writeCountry(item.country);
          writePatentNumber(item.patentNumber);
          break;
        case "interview":
          writeBase(item.title, interviewTag, toWatchStatus);
          writeCitationKey(item.citationKey);
          writeZoteroLink(item.key, item.libraryID);
          writeTags(item.tags);
          writeDate(item.date);
          writeHosts(item.creators);
          writeInterviewees(item.creators);
          writeMedium(item.interviewMedium);
          writeURL(item.url);
          break;
        case "preprint":
          writeBase(item.title, preprintTag, toReadStatus);
          writeCitationKey(item.citationKey);
          writeZoteroLink(item.key, item.libraryID);
          writeTags(item.tags);
          writeAuthors(item.creators);
          writeURL(item.url);
          break;
        case "encyclopediaArticle":
        case "dictionaryEntry":
          writeBase(item.title, encyclopeidaArticleTag, toReadStatus);
          writeCitationKey(item.citationKey);
          writeZoteroLink(item.key, item.libraryID);
          writeTags(item.tags);
          writeAuthors(item.creators);
          writeURL(item.url);
          writeEncyclopediaTitle(item.encyclopediaTitle || item.dictionaryTitle);
          writePublisher(item.publisher);
          break;
        case "radioBroadcast":
          writeBase(item.title, radioBroadcastTag, toListenStatus);
          writeCitationKey(item.citationKey);
          writeZoteroLink(item.key, item.libraryID);
          writeTags(item.tags);
          writeDirectors(item.creators);
          writeProgramTitle(item.programTitle);
          writeEpisodeNumber(item.episodeNumber);
          writeLocation(item.place);
          writeRadioNetwork(item.network);
          break;
        case "tvBroadcast":
          writeBase(item.title, tvBroadcastTag, toWatchStatus);
          writeCitationKey(item.citationKey);
          writeZoteroLink(item.key, item.libraryID);
          writeTags(item.tags);
          writeDirectors(item.creators);
          writeProgramTitle(item.programTitle);
          writeEpisodeNumber(item.episodeNumber);
          writeTvNetwork(item.network);
          writeLocation(item.place);
          writeDate(item.date);
          break;
        case "statute":
          writeBase(item.title, statuteTag, toReadStatus);
          writeCitationKey(item.citationKey);
          writeZoteroLink(item.key, item.libraryID);
          writeTags(item.tags);
          writeAuthors(item.creators);
          break;
        case "conferencePaper":
          writeBase(item.title, conferencePaperTag, toReadStatus);
          writeCitationKey(item.citationKey);
          writeZoteroLink(item.key, item.libraryID);
          writeTags(item.tags);
          writeAuthors(item.creators);
          writePublicationDate(item.date);
          writeConference(item.conferenceName);
          break;
        default:
          // Pass through anything not defined above as a new type for testing and configuration
          writeBase(item.title, tag(item.itemType));

          // Full object JSON for testing
          // Zotero.write("\n");
          // Zotero.write("\n");
          // Zotero.write(JSON.stringify(item));
          break;
      }
    }
  }
}
