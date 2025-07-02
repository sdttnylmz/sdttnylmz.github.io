// Ensure this script runs after the DOM is ready
document.addEventListener("DOMContentLoaded", function () {

  // Fetch the ENS name from the global variable in HTML
  const ensName = document.getElementById('ensName').value;
  
  const followersApiUrl = `https://api.ethfollow.xyz/api/v1/users/${ensName}/followers?include=ens&limit=10`;
  const followingApiUrl = `https://api.ethfollow.xyz/api/v1/users/${ensName}/following?include=ens&limit=10`;

  let followersOffset = 0;
  let followingOffset = 0;

  // Fetch and render Followers
  function fetchFollowers() {
      $.ajax({
          url: followersApiUrl + '&offset=' + followersOffset,
          method: 'GET',
          success: function (response) {
              const followers = response.followers;
              const profileList = $('#followersList');

              followers.forEach(follower => {
                  const ensName = follower.ens.name;
                  const avatar = follower.ens.avatar || 'https://via.placeholder.com/50'; // Default avatar if null

                  const profileItem = `
                      <div class="profile-item">
                          <div class="loader"></div>
                          <img src="${avatar}" alt="${ensName}" data-name="${ensName}" style="display:none;">
                          <div class="tooltip">${ensName}</div>
                      </div>
                  `;

                  profileList.append(profileItem);
              });

              if (followers.length < 10) {
                  $('#loadMoreFollowers').prop('disabled', true).text('No More Followers');
              }

              followersOffset += 10;

              // Once images are loaded, hide loader and show images
              $('.profile-item img').on('load', function () {
                  $(this).siblings('.loader').remove();
                  $(this).show();
              });
          },
          error: function (error) {
              console.error('Error fetching followers:', error);
          }
      });
  }

  // Fetch and render Following
  function fetchFollowing() {
      $.ajax({
          url: followingApiUrl + '&offset=' + followingOffset,
          method: 'GET',
          success: function (response) {
              const following = response.following;
              const profileList = $('#followingList');

              following.forEach(followingItem => {
                  const ensName = followingItem.ens.name;
                  const avatar = followingItem.ens.avatar || 'https://via.placeholder.com/50'; // Default avatar if null

                  const profileItem = `
                      <div class="profile-item">
                          <div class="loader"></div>
                          <img src="${avatar}" alt="${ensName}" data-name="${ensName}" style="display:none;">
                          <div class="tooltip">${ensName}</div>
                      </div>
                  `;

                  profileList.append(profileItem);
              });

              if (following.length < 10) {
                  $('#loadMoreFollowing').prop('disabled', true).text('No More Following');
              }

              followingOffset += 10;

              // Once images are loaded, hide loader and show images
              $('.profile-item img').on('load', function () {
                  $(this).siblings('.loader').remove();
                  $(this).show();
              });
          },
          error: function (error) {
              console.error('Error fetching following:', error);
          }
      });
  }

  // Fetch initial data
  fetchFollowers();
  fetchFollowing();

  // Load more followers on button click
  $('#loadMoreFollowers').click(function () {
      fetchFollowers();
  });

  // Load more following on button click
  $('#loadMoreFollowing').click(function () {
      fetchFollowing();
  });

  // Tooltip on hover
  $(document).on('mouseenter', '.profile-item img', function () {
      const tooltip = $(this).siblings('.tooltip');
      tooltip.show();
  });

  $(document).on('mouseleave', '.profile-item img', function () {
      const tooltip = $(this).siblings('.tooltip');
      tooltip.hide();
  });
});