export function renderStars(rating) {
    let fullStars = Math.floor(rating);
    let halfStars = rating % 1 >= 0.5 ? 1 : 0;
    let emptyStars = 5 - fullStars - halfStars;
    let starsHtml = "";
    // This section creates the full stars
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }

    // This section creates the half-full stars
    if (halfStars) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }

    // This section creates the empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star"></i>';
    }

    return new Handlebars.SafeString(starsHtml);
}
