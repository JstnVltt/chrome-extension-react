# Prompt 1
you are in charge of evaluating if the urls i'm giving you are productive platform (work friendly) or improductive. 
Give me your advice as a friend on what you think should be blacklisted. If the website has potential of time drain, 
like doomscroll or high dopamine content, it should be blacklisted. I will give you an entry and depending on the content 
of this entry, your answer has to be different. : if the array is not [], give me an array of objects like that :   
[{url:'http://example.com',isProductive:true'},{url:'http://example2.com',isProductive:false'}]. 
  if the list of urls is empty (entry : []), give me directly the following string : "no urls to recommend, you are very 
productive! I want you to give me directly the answer, like you would give it to a friend, not in terms of code.

Entry : [twitter.com, notion.com, facebook.com, stackoverflow.com, youtube.com, tiktok.com, gmail.com, origami.com]

# Prompt 2
I give you an entry with urls and time spent on them in seconds. Answer with no code with these instructions :
i want you to give me an array of urls that are present in the real entry that are not productive for work. These criterias
make an url not productve : time consuming, entertainment, high dopamine.
On contrary, these criterias make urls productive and therefore not shown on the output : exchanging by emails, 
coding related, research related, office, productivity, communicating with co-workers, giving knowledge or facts.
Examples :
Example 1 :
Entry : {tiktok.com:6666, google.com:20}
Output : [tiktok.com]
Explaination : tiktok is a social media that drains time and is not productive.

Example 2 :
Entry : {origami.com: 50, gmail.com: 7777, youtube.com: 500}
Output : [youtube.com]
explaination : origami.com is not related to work but has low time spent compared to other urls. Youtube has a high time and is not linked to work, so not productive. gmail has a really high time spent but is used to work with co-workers and is productive.

Example 3 :
Entry : {gmail.com: 6000, google.com: 5000, outlook.com: 7000}
Output : []
explaination : all the urls are considered as productive because they are used to search (google.com) or to communicate with others (gmail.com, outlook.com).

Example 4 :
Entry : {instagram.com.com: 8888, gmail.com: 50000, outlook: 500, linkedin.com: 6000}
Output : [instagram.com, linkedin.com]
Explaination : instagram is a social media with potential of time retention and is not linked to work so does'nt contribute
to being productive. Even though linkedin can be seen as productive, the amount of time is too high to considere it being
productive. outlook and gmail are both websites that contribute in being productive byy the mean of sending emails to 
co-workers


Real entry : {snapchat.com: 8888, microsoft.teams.com: 50000, gmail.com: 6000, stackoverflow.com: 50000, tiktok.com: 6000}
Output : 

# Prompt 3
i want you to set Blacklisted to Yes if the website is a social media. Give me an answer similar to this one : 
[twitter.com: Yes, notion.com: no]
Entry : [tiktok.com, google.com, microsoft.teams.com, linkedin.com, stackoverflow.com] 

# Prompt 4
I am a javascript program. I have a dictionnary of urls named "Dictionnary" linked to the time spent by the user on each of them. 
  My objective is to find urls to blacklist to make the user more productive. I will give you this dictionnary and I want you to take in account the time associated with each url, 
  as well as the type of url in regard of being productive, and give me in response with no code an array of urls included in this dictionnary that should be blacklisted to 
  gain productivity. If it's related to social media or spending a lot of time on an entertainment, label it as non-productive. If it is ambiguous and has a abnormal amount of time, 
  label it as non-productive. The output should have a maximum size of 3, have the name "Array" and should strictly have urls that are in the variable "Dictionnary". If you encounter a line with "// Example", you should avoid returning this line as a result. 
  If Dictionnary is "{}", say "No recommendation needed, you are very productive !". Every "Entry / Output" lines are examples for you to train and should be isolated 
  from the content of Dictionnary. If you are unsure about something, ask me questions. Examples:
Entry : {}
Output : "No recommendation needed, you are very productive !" // Example
Entry : {youtube.com: 567, linkedin.com: 6000: google.com: 500}
Output : [youtube.com, linkedin.com] // Example
Entry : {tiktok.com: 60, origami.com: 45, outlook.com: 780}
Output : [tiktok.com, origami.com] // Example
Entry : {minecraft.com: 500, gmail.com: 70}
Output : [minecraft.com] // Example

Dictionnary :  ${urlsTimestamp}
Array :

--------------------------------------------------------------
# Prompt stable
you are in charge of evaluating if the urls i'm giving you are productive platform (work friendly) or improductive. 
If the website has potential of time drain, is a social media or has too much time associated, it should be blacklisted. 
I will give you an entry and depending on the content of this entry, your answer has to be different. : 
if the array is like '{"url": time}', give me an array of objects like that :   
[{url:'http://example.com',isProductive:true'},{url:'http://example2.com',isProductive:false'}] depending on the time 
associated with each url and on the url. 
If the entry is '{}', give me directly the following string : "no urls to recommend". I want you to give me directly the answer, like you would give it to a friend, not in terms of code.

Entry : {
  "https://chrome.dev/web-ai-demos/prompt-api-playground/": 4.835,
  "https://www.linkedin.com/": 92.984,
  "https://stackoverflow.com/": 181.903,
  "https://www.gmail.com/": 1.178,
  "https://www.tiktok.com/": 186.333
}
Output :

```
Remarques :
- fonctionne également avec {} en entrée (affiche "no urls to recommend).
- est flexible au niveau des temps donnés.

Problèmes :
- ne fonctionne plus correctement après 5 urls. Affiche des "true" de partout.
- ne fonctionne plus si on lui met des urls trop longues ou bizarre comme [object Object] ou "". Besoin d'assainir l'entrée. 
```

