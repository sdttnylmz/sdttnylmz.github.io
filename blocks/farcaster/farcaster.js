document.querySelectorAll('.card-container-far').forEach(containerfar => {
    const keyword = containerfar.dataset.keyword;
           let currentLimit = 10;
           let isLoadingfar = false;
           let noMoreItemsfar = false;
           let displayedActivitiesfar = [];
           let userProfilefar = null;
  
  
           // Now, IDs will be based on the keyword, not hardcoded
   const activityFeedfar = containerfar.querySelector('#activity-feed-far');
   const profileInfoElementfar = containerfar.querySelector('#profile-info-far');
   const loadMoreContainerfar = containerfar.querySelector('#load-more-container-far');
   const noMoreItemsMessagefar = loadMoreContainerfar.querySelector('#no-more-items-far');
  
           
          const fetchProfilefar = async () => {
              try {
                const response = await fetch(`https://testnet.rss3.io/data/accounts/${keyword}/profiles?platform=Farcaster`);
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                if (data && data.data && data.data.length > 0) {
                  userProfilefar = data.data[0];
                  // Display the profile here if needed, or make sure its container is visible
                 // const  profileInfoElement = document.getElementById('profile-info');
                  if ( profileInfoElementfar) {
                    profileInfoElementfar.style.display = 'none'; // or whatever it should be to show
                  }
                  // ... rest of code to display profile data ...
                } else {
                  userProfilefar = null;
                  // If no profile, ensure the profile container is not taking up space
                  // const  profileInfoElement = document.getElementById('profile-info');
                  if ( profileInfoElementfar) {
                    profileInfoElementfar.style.display = 'none'; // Hide the container
                  }
                  // Immediately fetch and display activities without any message or space
                  fetchAndDisplayActivitiesfar();
                }
              } catch (err) {
                console.error('Fetch profile failed:', err);
                if ( profileInfoElementfar) {
                  profileInfoElementfar.style.display = 'none'; // Hide the container
                }
                // If there is an error fetching the profile, still try to fetch activities
                fetchAndDisplayActivitiesfar();
              }
            };
            
            // ... rest of your code ...
            
            
            const fetchAndDisplayActivitiesfar = async () => {
              try {
                const activitiesfar = await fetchActivitiesfar(10); // Fetch 10 activities as an example
                if (activitiesfar && activitiesfar.length > 0) {
                  displayActivitiesfar(activitiesfar);
                }
              } catch (err) {
                console.error('Fetch activities failed:', err);
              }
            };
            
            // Ensure fetchActivities() and displayActivities() are also defined and work correctly.
            
           
           const fetchActivitiesfar = async (limit) => {
             const options = {
               method: 'GET',
               headers: { accept: '*/*' }
             };
           
             try {
               const response = await fetch(`https://testnet.rss3.io/data/accounts/${encodeURIComponent(keyword)}/activities?limit=${limit}&direction=out&action_limit=1&platform=Farcaster`, options);
               const data = await response.json();
               return data.data;
             } catch (err) {
               console.error(err);
               return null;
             }
           };
           
           const displayActivitiesfar = (activitiesfar) => {
             //const activityFeed = document.getElementById('activity-feed');
             
           
             activitiesfar.forEach(activity => {
              const relevantActions = activity.actions.filter(action => !displayedActivitiesfar.includes(activity.timestamp));            
               if (relevantActions.length > 0) {
                 displayedActivitiesfar.push(activity.timestamp); // Track displayed activities to avoid duplicates
                 const activityElementfar = document.createElement('div');
                 activityElementfar.className = 'activity-item-far';
      
           
                 
                 let content = '';
                 relevantActions.forEach(action => {
                   let iconHtmlfar = userProfilefar && userProfilefar.profileURI ? `<img src="${userProfilefar.profileURI[0]}" class="activity-icon-far" alt="Avatar">` : '';
                   const handle = action.metadata.handle;
                   const body = action.metadata.body || 'Shared a post on Farcaster';
                   const targetHandle = action.metadata.target ? action.metadata.target.handle : '';
                   const targetBody = action.metadata.target ? action.metadata.target.body : '';
                   const targetUrl = action.metadata.target_url ? action.metadata.target_url : '';
                   const date = new Date(activity.timestamp * 1000).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                   const relatedUrls = action.related_urls ? action.related_urls : '';
                   
                   content += `<div class="d-flex-far flex-column align-items-start mb-2">`;
                   content += `<a href="${relatedUrls}" target="_blank" class="message-far" style="width: 100%; text-decoration: none;">`;
                   content += `${iconHtmlfar}`;
                   content += `<div>`; 
                   content += `<h2 class="word-far">${handle}</h2>`;
                   content += `<p class="text-far">${body}</p>`;
                   content += `</div>`;
                   content += `<div class="activity-date-far">${date}</div>`;
                   content += `</div>`;
           
                   const getHttpUrlForIpfs = (ipfsUrl) => {
    if (ipfsUrl.startsWith('ipfs://')) {
      return `https://w3s.link/ipfs/${ipfsUrl.slice(7)}`;
    }
    return ipfsUrl;
  };
  
  if (action.metadata.media && action.metadata.media.length > 0) {
    action.metadata.media.forEach(media => {
      const mediaUrl = getHttpUrlForIpfs(media.address);
      if (media.mime_type.startsWith('image')) {
        content += `<div class="activity-media-far"><img src="${mediaUrl}" alt="Media content"></div>`;
      } else if (media.mime_type.startsWith('video')) {
        content += `<div class="activity-media-far"><video src="${mediaUrl}" controls></video></div>`;
      }
    });
  }
  
                   if (targetHandle && targetBody) {
                     content += `<a href="${targetUrl}" target="_blank" class="card-far" style="width: 100%; text-decoration: none;">`;
                     content += `<div class="card-body-far">`;
                     content += `<h5 class="card-title-far">${targetHandle}</h5>`;
                     content += `<p class="card-text-far">${targetBody}</p>`;
                     content += `</div>`;
                     content += `</a>`;
                   }
                 });
                
                 activityElementfar.innerHTML = content;
                 activityFeedfar.appendChild(activityElementfar);
               }
             });
           
             if (activitiesfar.length === 0 && !document.getElementById('no-activities-msg-far')) {
           // Display a message if there are no activities
           const noActivitiesMsgfar = document.createElement('div');
           noActivitiesMsgfar.id = 'no-activities-msg-far';
           noActivitiesMsgfar.innerText = 'No activities available';
           activityFeedfar.appendChild(noActivitiesMsgfar);
           }
           
           };
           
           
    // const loadMoreDatafar = async () => {
    //   if (isLoadingfar || noMoreItemsfar) return;
    //   isLoadingfar = true;
  
    //   // Add spinner
    //   const spinnerfar = document.createElement('div');
    //   // spinnerfar.className = 'spinner-far';
    //   document.getElementById('activity-feed-far').innerHTML +='<div class="spinner-far"></div>'; 
    //   loadMoreContainerfar.appendChild(spinnerfar);
  
    //   try {
    //     const activitiesfar = await fetchActivitiesfar(currentLimit);
    //     // Remove spinner from the loadMoreContainer in the current container
    //     spinnerfar.remove();
    //     displayActivitiesfar(activitiesfar);
  
    //     // Check if we've reached the limit and noMoreItems has not been set
    //     if (currentLimit >= 100 && !noMoreItemsfar) {
    //       noMoreItemsfar = true;
    //       isLoadingfar = false; // Stop loading as we've reached the limit
          
    //       // Ensure the noMoreItemsMessage is not already visible before updating its content
    //       if (noMoreItemsMessagefar && noMoreItemsMessagefar.style.display !== 'block') {
    //         noMoreItemsMessagefar.innerHTML = userProfilefar && userProfilefar.url 
    //           ? `<a class="findusfar" href="${userProfilefar.url}" target="_blank">Find out more at ${keyword}</a>` 
    //           : 'No new items to show.';
    //         noMoreItemsMessagefar.style.display = 'block'; // Make sure it's visible
    //       }
    //     } else {
    //       // Increase currentLimit only if we haven't reached the end
    //       currentLimit += 10;
    //     }
    //   } catch (error) {
    //     console.error('Error loading more data:', error);
    //     spinnerfar.remove();
    //   }
  
    //   isLoadingfar = false;
    // };
    const loadMoreDatafar = async () => {
      if (isLoadingfar || noMoreItemsfar) return;
      isLoadingfar = true;
  
      // Add spinner directly using insertAdjacentHTML on the referenced container
      activityFeedfar.insertAdjacentHTML('beforeend', '<div class="spinner-far"></div>'); // Show spinner
  
      try {
          const activitiesfar = await fetchActivitiesfar(currentLimit);
          // Remove spinner by selecting it from the referenced container
          const spinnerElement = activityFeedfar.querySelector('.spinner-far');
          if (spinnerElement) spinnerElement.remove(); // Hide spinner
          displayActivitiesfar(activitiesfar);
  
          if (currentLimit >= 100 && !noMoreItemsfar) {
              noMoreItemsfar = true;
              // Update the noMoreItemsMessage using the referenced container
              noMoreItemsMessagefar.innerHTML = userProfilefar && userProfilefar.url 
                  ? `<a class="findusfar" href="${userProfilefar.url}" target="_blank">Find out more at ${keyword}</a>` 
                  : 'No new items to show.';
              noMoreItemsMessagefar.style.display = 'block'; // Make sure it's visible
              isLoadingfar = false; // Stop loading as we've reached the limit
          } else {
              // Increase currentLimit only if we haven't reached the end
              currentLimit += 10;
          }
      } catch (error) {
          console.error('Error loading more data:', error);
          // Hide spinner in case of error
          const spinnerElement = activityFeedfar.querySelector('.spinner-far');
          if (spinnerElement) spinnerElement.remove();

      }
  
      isLoadingfar = false;
  };
  
         
            const checkActivityFeedScrollfar = () => {
                if (activityFeedfar.scrollTop + activityFeedfar.clientHeight >= activityFeedfar.scrollHeight - 10 && !isLoadingfar && !noMoreItemsfar) {
                loadMoreDatafar();
                }
                };
               
               
               activityFeedfar.addEventListener('scroll', checkActivityFeedScrollfar);
        
  
           const initializeInfiniteScrollfar = async () => {
           await fetchProfilefar();
           await loadMoreDatafar(); // Load initial data
           };
           
           initializeInfiniteScrollfar();
          });