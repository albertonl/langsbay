# Final Project: Langsbay

<img src="/src/learning/static/learning/img/logo-dark.png" alt="Langsbay Logo" width="350">

**Langsbay** is intended to be a collaborative and community-driven application to help you learn a new language easily and quickly. As of now, it includes an open dictionary in more than 20 languages, but hopefully, it will continue to grow and we will add more features accordingly.

Some learners struggle to acquire the new language, but with Langsbay, it becomes a piece of cake. As per the enormous success of open communities, such as [Wikipedia](https://en.wikipedia.org/), and the insane amounts of trustful information in those platforms, the idea of creating an open dictionary might even result in better explanations than in more recognized ones, due to the fact that everyone can discuss on what the best content is.

## How does it work?

Anyone can create a Langsbay account and access all of the available features for free. Then, they can browse the dictionary, edit and report fields in a term, as well as add new terms to the dictionary, and match them to existing terms as translations, which are stored in [translation groups](#what-is-a-translation-group).

However, non-trivial actions, such as the creation of terms are identified and tracked, as to avoid any malicious intentions from the user. **In this process, only a Foreign Key to the User object is saved. We _don't_ collect any not-in-app information, like IP addresses, locations, etc.**

## What is a translation group?

A **translation group** is an instance of a `Translation` object, which spans through a number of `DictionaryTerm` objects. The purpose of this association is the generation of a dynamic group of terms in different languages with the same or a similar meaning.

For example, a translation group could be represented in the following way:

```
+--------------------+
| Translation object |
+--------------------+
  |
  +----> Meaning (implicit): four-wheeled personal vehicle used to transport a reduced number of people in short/medium distances.
  |
  +----> Associated terms (explicit):
           |
           +--> English (en): car
           |
           +--> Spanish (es): coche
           |
           +--> Russian (ru): машина (/mɐʂˈɨnə/)
           |
           +--> Japanese (ja): 車 (kuruma)
```

### How does a translation group work?

When creating a new term, you can associate an existing term in another language as a translation if it has the same or a very similar meaning. If that term had no associated translations, a new `Translation` object will be created, matching the two terms. Otherwise, the new term will simply be appended to the existing translation group, automatically affecting all of the existing terms within the same group.

Therefore, if we take the example above, and decide to add the German term _Wagen_, and match it to the English translation _car_, our new term _Wagen_ is appended to the associated terms list. Once we submit and create the new term, we will be able to observe the term _car_ listed in the translations section, as well as _coche_, _машина_ and _車_, although we originally hadn't selected them. This happens because they all have the same or a very similar meaning, and therefore these terms are automatically matched together.

In the same way, if we were to visit the page for _coche_, we would also see _Wagen_ listed in the translations section.
