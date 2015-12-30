import Request from 'superagent';
import OAuth from './OAuth';

class reddit {

    constructor() {
        this.baseUrl = "https://www.reddit.com";
        this.unsecureBaseUrl = "http://www.reddit.com";
        this.baseOAuthUrl = "https://oauth.reddit.com";
        this.extension = ".json";
        this.proxy = "http://reditr.com/api/sync/";
        this.authUser = null;
    }

    setAuth(userObj) {
        this.authUser = userObj;
    }

    getCurrentAccountInfo(callback) {

        Request
            .get(this.baseOAuthUrl + "/api/v1/me" + this.extension)
            .set("Authorization", "bearer " + this.authUser.accessToken)
            .end(callback);

    }

    getPostsFromSubreddit(subreddit, options = { sort: "hot" }, callback) {
        Request
            .get(this.baseUrl
                + "/r/"
                + subreddit
                + "/"
                + options.sort
                + this.extension)
            .query(options)
            .end(callback);

    }

    getPostsFromUser(user, options = { sort: "hot" }, callback) {

        Request
            .get(this.baseUrl
                + "/user/"
                + user
                + "/"
                + this.extension)
            .query(options)
            .end(callback);

    }

    getPostFromPermalink(permalink, options = { sort: "hot" }, callback) {

        Request
            .get(this.baseUrl + permalink + this.extension)
            .query(options)
            .end(callback);

    }

    searchForSubredditsWithQuery(query, callback) {
        Request
            .post(this.proxy + "?forward=" + this.unsecureBaseUrl + "/api/search_reddit_names" + this.extension)
            .send({ query: query })
            .set("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
            .end(callback);
    }

    getSubredditBio(subreddit, callback) {
        Request
            .get(this.baseUrl + "/r/" + subreddit + "/about" + this.extension)
            .end(callback);
    }

}

export default new reddit;
