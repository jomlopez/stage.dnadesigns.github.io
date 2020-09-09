const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    if (scrollPos > 10) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled')
    }
});

const instagramRegExp = new RegExp(
    /<script type="text\/javascript">window\._sharedData = (.*);<\/script>/
  );
  
  const fetchInstagramPhotos = async (accountUrl) => {
    const response = await axios.get(accountUrl);
    const json = JSON.parse(response.data.match(instagramRegExp)[1]);
    const edges = json.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges.splice(
      0,
      12
    );
    const photos = edges.map(({ node }) => {
      return {
        url: `https://www.instagram.com/p/${node.shortcode}/`,
        thumbnailUrl: node.thumbnail_src,
        displayUrl: node.display_url,
        caption: node.edge_media_to_caption.edges[0].node.text
      };
    });
    return photos;
  };
  
  (async () => {
    try {
      const photos = await fetchInstagramPhotos(
        "https://www.instagram.com/d.n.a.designs/"
      );
      const container = document.getElementById("instagram-feed");
      var ctr = 1;
      photos.forEach((el) => {
        if (ctr <= 7) {
            const a = document.createElement("a");
            const img = document.createElement("img");
            // const caption = document.createElement("span");
            const post = document.createElement("div");
    
            a.setAttribute("href", el.url);
            a.setAttribute("target", "_blank");
            a.setAttribute("rel", "noopener noreferrer");
            a.classList.add("instagram-photo");
    
            img.setAttribute("src", el.thumbnailUrl);
            img.setAttribute("alt", el.caption);

            // caption.innerHTML = el.caption;
    
            a.appendChild(img);
            // a.appendChild(caption);
            post.appendChild(a);
            container.appendChild(post);
        }
        ctr++;
      });
    } catch (e) {
      console.error("Fetching Instagram photos failed", e);
    }
  })();
  