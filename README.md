# Zotero to Tana Exporter

[![Watch the video](https://img.youtube.com/vi/SZoHQOPOBC0/hqdefault.jpg)](https://youtu.be/SZoHQOPOBC0)

This is a simple script to export the bibliographic metadata from Zotero into a Tana paste format, which can then be pasted directly into your Tana graph. I've tried to build it such that even a non-programmer can make many small tweaks to the resulting format to fit their specific needs. The base export as stored in this repository is principally based upon [Tanarian Brain](https://www.cortexfutura.com/tanarian-brain/) and the work of [CortexFutura](https://twitter.com/cortexfutura/).

One quick warning... there is an upper limit to the number of characters Tana paste can handle in a single paste event. It's a quite large number, and I usually only add one or two entires at a time to Tana. So, you probably won't run into any problems. However, if you have dozens or hundreds of items you want to add to Tana, you should work in batches of a handful at a time. I doubt you'll have any issues pasting 5-10 entries at a time, but 50-100+ entries is likely to overwhelm what Tana can process in one go.


## Installation

* Cloen or download this git repository
* Copy/move the `Tana Metadata Exporter.js` to your `./translators` directory for Zotero. The exact location will depend upon your Zotero installation and operating system. The default location on macOS is `~/Zotero/translators`.
* Open Zotero. NOTE: If Zotero is already open, you'll need to close and re-open it for the new translator to become available.
* Open Zotero Settings => Export. Select "Tana Metadata Export" from the "Item Format" dropdown. Leave the "Note Format" as "Markdown + Rich Text."


### Modify the names of your tags, statuses, and fields.

I started with the [Tanarian Brain](https://www.cortexfutura.com/tanarian-brain/) organization of sources. However, there are a few minor changes I made from the vanilla implementation. So, the names may differ slightly from what you're using, and you should confirm they're aligned to your needs.

* Open the `Tana Metadata Exporter.js` file in your local Zotero installation with a plain text editor (Notepad++, TextEdit, Sublime, etc. all work fine).
* Scroll down to the constants describing tags, statuses, and fields. This starts with `const sourceTag = tag("source");`
* Review each of the constants to ensure they match your graph correctly. For example, if you use `#src` instead of `#source`, then you'd want to modify the line to read `const sourceTag = tag("src");`.

**IMPORTANT:** Hashtags, brackets, etc. will be added automatically to ensure consistency. These only require the text name of the node and nothing else. Emojis should be included as well if they're part of the node name in your graph. This is why we used "src" NOT "#src" in the example above.


### Modify the list of ignored topics

Zotero tags are translated as topics for the Tana export. However, there are often some Zotero tags that are purely internal. For example, `_tablet` and `_tablet_modified` are used by ZotFile out of the box to manage documents moved to shared drives or mobile devices for consumption. Simply add any tags you want to have ignored to the array `ignoredTopics[]`. Any tags that match this list will be ignored (i.e., NOT exported Tana) when generating the list of topics.


### Optional: Disambiguation configuration

I highly recommend you disambiguate your Tana supertags and fields by adding explicit IDs for each. This will prevent accidentally creating duplicate supertags/fields, especially when working across multiple graphs in Tana. It's quite simple to add to your local copy of the exporter.

* Open the `Tana Metadata Exporter.js` file in your local Zotero installation with a plain text editor (Notepad++, TextEdit, Sublime, etc. all work fine).
* Scroll down to the constants describing tags, statuses, and fields. This starts with `const sourceTag = tag("source");`
* For each of tag, status, and field we want to add an explicit reference to your implementation of each node.
  1. Get the node link in your Tana graph.
  2. Paste this somewhere temporarily, because we don't need the entire URL.
  3. Copy the node ID that comes after `nodeid=` in the URL.
  4. In `Tana Metadata Exporter.js` for the node append a carrot (^) then the node ID.
* Restart Zotero

For example, let's look at the first tag in the file.

```
const sourceTag = tag("source");
```

Going into my graph, I select the `#source` supertag. I then get a link to the `#source` supertag node, which copies `https://app.tana.inc?nodeid=p_7iFOOsX3`.

Then, I update the line in the Tana exporter file to read...

```
const sourceTag = tag("source^p_7iFOOsX3");
```

Rinse and repeat for every tag, status, and field listed in the exporter file. Takes a bit of time, but will likely save you many headaches later.


## Usage

Now, when you select an item or items in your library, you'll see the option "Copy as Tana Metadata Export" in the Edit menu. The shortcut on macOS is ⌘ + ⇧ + C (command + shift + C).

* Select the item or items you want to add to Tana
* Copy as Tana Metadata Export (⌘ + ⇧ + C) from your Zotero library
* Paste (⌘ + V) into Tana


## Modifying for Your Individual Needs

This code is a bit verbose, but I felt it'd make it easier to modify for your individual needs later. In fact, even somebody with no programming experience can make important personalization changes to this script.

* Open the `Tana Metadata Exporter.js` file in your local Zotero installation with a plain text editor (Notepad++, TextEdit, Sublime, etc. all work fine).
* Make changes you want
* Restart Zotero for the new changes to take effect


### Remove fields you don't need

The easiest modfication is removing any fields you don't want from the exported content. For example, I've added both a citation key and Zotero link to my root `#source` supertag in Tana. However, you may not want those fields at all in your exported data.

Scroll all the way down to the switch statement at the bottom. It starts with `switch(item.itemType) {`. Comment out or deleted any elements you don't want from each Zotero record type described in this switch.

You'll see each type of Zotero record described here in a fairly human-readable way. As example, this snippet describes what will be included when exporting a journal article from Zotero.

```
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
```

This is saying when exporting the `journalArticle` Zotero type, we want to include the base information (required first step for every type), citation key, zotero link, list of authors, journal title, etc. To remove the citation key and Zotero link anytime we export a journal article, we just need to comment out (or delete) those revelant lines. So, we end up with something that looks like this...

```
case "journalArticle":
  writeBase(item.title, journalArticleTag, toReadStatus);
  // writeCitationKey(item.citationKey);
  // writeZoteroLink(item.key, item.libraryID);
  writeAuthors(item.creators);
  writeJournalTitle(item.publicationTitle);
  writePublicationDate(item.date);
  writeVolume(item.volume);
  writeIssue(item.issue);
  writeURL(item.url);
  writeDOI(item.DOI);
  writeTags(item.tags);
  break;
```

Repeat this step by removing the fields you no longer want from every other Zotero type described.


### Update existing fields

Depending upon your comfort with code, this may or may not be quite as easy as removing fields you don't need.

Each field was given it's own function. The field may be used in several Zotero types. For example, there are several types that list authors (e.g., journal article, book, thesis, etc.), but only one function to list the authors. How difficult a change will be depends entirely upon what you're trying to accomplish. However, this encapsulation means you only need to update the function in one place to affect every place that field is used.

For example, let's say you don't want to append a `#journal (publication)` tag when using the `Journal:: ` field. The journal field will just capture a plain string without any tagging in your graph.

Here's the current journal field function

```
  // Write the journal title
  const writeJournalTitle = (journalTitle, t = 1) => {
    // - Journal:: Foo Bar #[[journal (publication)]]
    if (journalTitle !== undefined && journalTitle !== "") {
      Zotero.write(tab[t] + journalField + journalTitle + journalPublicationTag + "\n");
    }
  };
```

We just need to remove the `journalPublicationTag` from the output to not tag the journal title. So, we end up with...

```
  // Write the journal title
  const writeJournalTitle = (journalTitle, t = 1) => {
    // - Journal:: Foo Bar #[[journal (publication)]]
    if (journalTitle !== undefined && journalTitle !== "") {
      Zotero.write(tab[t] + journalField + journalTitle + "\n");
    }
  };
```

That's somewhat trival example, but 


### Add new fields

Depending upon your comfort with code, this may or may not be quite as easy as removing fields you don't need.

Similar to modify, but a bit more. Adding new fields will just require 
* Adding new constants for any missing fields, tags, or statuses
* Adding new functions to write the content out
* Calling those new functions on relevant Zotero types

The detailed [Zotero schema](https://api.zotero.org/schema) reference is a fantastic resource to understand what information is available to export.


## Submitting a PR, Bug, or Feature Request

Given the simplicity of this script and repository, there isn't any need for a formal process. Just submit a PR if you have something to contribute. Or, you can [submit a ticket](https://github.com/joshjhall/zotero-to-tana-exporter/issues) directly on GitHub.


## License

All of this is licensed under the MIT opensource license.
