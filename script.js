/*
  Name: Katie Williams
  Date: 03.22.26
  CSC 372-01

  This is the script.js page for my github repository gallery project. It includes the main functionality for the site, including
  generating the default gallery, which includes my repositories, getting information from the user from a searchbar, and utilizing
  the fetch api to grab information from github to display information about the input users repositories. 
*/


//Declaring a constant for the default api that will be displayed when the page loads
const myApiUrl = "https://api.github.com/users/katienovi/repos?per_page=10";
//Creating constants for the search bar, button, and the where the gallery cards will be displayed
const searchButton = document.getElementById('button');
const searchBar = document.getElementById('searchbar');
const galleryInfo = document.getElementById('repo-cards');

//Event listener for when the page loads
document.addEventListener('DOMContentLoaded', initialRepos);
//Event listener for when the search button is pressed
searchButton.addEventListener('click', loadRepos);

/*
This function displays the default repo (my personal repo) when the page loads using a fetch api method.
It displays an error message and the reason for the error if the api cannot be retrieved.
*/
function initialRepos(){
  fetch(myApiUrl)
    .then((response) => {
      if (!response.ok) {
        console.log(response.status);
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((repoData) => {
      repoData.forEach(repo => displayRepos(repo));
    })
    .catch((error) => {
      galleryInfo.textContent = 'Error retrieving personal repo: ' + error;
    });
}

/*
This function fetches up to ten of the searched for (or default) users repos using a fetch api.
*/
function loadRepos(){
  //Getting whatever the user searched for from our searchbar.
  let repoName = searchBar.value;
  //Adding the necessary elements to the users entered repo name so that we can search for it.
  const repoUrl = 'https://api.github.com/users/' + repoName + '/repos?per_page=10';

  //fetching the users repo from the provided url and displaying an error message if it cannot be retrieved.
  fetch(repoUrl)
    .then((response) => {
      if (!response.ok) {
        console.log(response.status); 
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((repoData) => {
      //Clearing whatever repo was previously searched for
      while (galleryInfo.hasChildNodes()){
        galleryInfo.removeChild(galleryInfo.firstChild);
      }

      //Checking to see if no repositories were returned, and displaying a message if there was nothing.
      if (repoData.length == 0){
        galleryInfo.textContent = 'No repositories returned. Please enter an account name with some repositories!'
      }

      //Going through each repo and calling the displayRepos method for each.
      repoData.forEach(repo => displayRepos(repo));
    })
    .catch((error) => {
      galleryInfo.textContent = 'Error retrieving searched for repo: ' + error + '. Make sure you entered an existing github username.';
    });

}

/*
This function displays the users repos, including the repos name, description, date created, date updated, number of watchers,
and uses another fetch to get the repos used languages.
*/
  function displayRepos(repo){
        //Creating an element to display the repos in cards.
        const galleryCard = document.createElement('div');
        galleryCard.classList.add('galleryInfo');

        //Making a heading to display the name of the repo and adding it to our card via a hyperlink.
        const a = document.createElement('a');
        const linkText = document.createElement('h4');
        linkText.textContent = (repo.name);
        
        a.appendChild(linkText);
        a.title = repo.name;
        a.href = repo.html_url;
    
        galleryCard.appendChild(a);

        //Making a paragraph to display the description of the repo and adding it to our card.
        const description = document.createElement('p');

        description.textContent = repo.description;

        //If there is no description for the repo, displays no description instead of a blank space.
        if (repo.description == null){
          description.textContent = 'No description'
        }

        galleryCard.appendChild(description);

        //Making a paragraph to display the creation date of the repo and adding it to our card.
        const created = document.createElement('p');
        
        //Creating a new date to just have access to the date and not also the time.
        const timeCreated = new Date(repo.created_at).toISOString().split('T')[0];

        created.textContent = 'Created: ' + timeCreated;
        galleryCard.appendChild(created);

        //Making a paragraph to display the date the repo was updated and adding it to our card.
        const updated = document.createElement('p');

        const timeUpdated = new Date(repo.updated_at).toISOString().split('T')[0];

        updated.textContent = 'Updated: ' + timeUpdated;
        galleryCard.appendChild(updated);

        //Making a paragraph to display the number of watchers of the repo and adding it to our card.
        const watchers = document.createElement('p');
        watchers.textContent = 'Watchers: ' + repo.watchers_count;
        galleryCard.appendChild(watchers);

        //using fetch to get the languages associated with the repo, and displays an error message if the fetch fails.
        fetch(repo.languages_url)
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .then((repoData) => {
              const languagesList = Object.keys(repoData);

              const languageText = languagesList.toString();

              const languages = document.createElement('p');

              languages.textContent = 'Languages: ' + languageText;

              //If there are no languages, displays that there are non in the card.
              if (languagesList.length == 0){
                languages.textContent = 'Languages: None';
              }

              galleryCard.appendChild(languages);
            })
            .catch((error) => {
              galleryInfo.textContent = 'Error retrieving Languages for repo: ' + error;
            });


        //Appending all of the repo information to the gallery section of the website.
        galleryInfo.appendChild(galleryCard);
    }


