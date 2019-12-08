WordPress Plugin

<%= pluginDesc %>

> Further information: [./dist/trunk/README.md](<%= gitHubPluginURI %>/tree/master/dist/trunk)

* Contribution welcome :)
* For **support**, to **request new plugin-features** or inform me about **issues and bugs** [create a new issue on Github](<%= gitHubPluginURI %>/issues/new) ~~or [add a new topic to WP's support forum](https://wordpress.org/support/plugin/<%= pluginSlug %>)~~
* ~~Love to get your **feedback**, [Create a new review and rate this Plugin](https://wordpress.org/support/plugin/<%= pluginSlug %>/reviews/#new-post),~~ write a tutorial and tell your friends.
* [Tell me](<%= pluginAuthorUri %>) your wishes, maybe get me a bowl of rice and some masala: [Donate](<%= donationLink %>)

## How to install:

~~**<%= pluginName %>**  is [available in the official WordPress Plugin repository](https://wordpress.org/plugins/<%= pluginSlug %>/). You can install this Plugin the same way you'd install any other plugin.~~

To install it from this GitHub Repo:

- download the latest release asset from [```Releases```](<%= gitHubPluginURI %>/releases).
- alternatively download the latest distributed version from [```./dist/trunk```](<%= gitHubPluginURI %>/tree/master/dist/trunk) and rename ```trunk``` to ```<%= pluginSlug %>```
- upload to your plugins directory and activate

To test the latest commit or make code changes yourself:

- Clone, fork or [download](<%= gitHubPluginURI %>/archive/master.zip) the repository

***

This Plugin and its development environment are based on [generator-pluginboilerplate](https://www.npmjs.com/package/generator-pluginboilerplate) v<%= generatorVersion %>. Check the generator readme for documentation.