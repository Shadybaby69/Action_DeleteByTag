const core = require('@actions/core');
const { context} = require('@actions/github');
const github = require('@actions/github');

(async () => {
    try {
        // Get authenticated GitHub client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
        const octokit = github.getOctokit(process.env.GITHUB_TOKEN)


        // Get owner and repo from context of payload that triggered the action
        const { owner: currentOwner, repo: currentRepo } = context.repo

        // Owner of Repo and Repo itself to get Tag from, as input or from context
        const assetOwner = core.getInput('owner', { required: false }) || currentOwner
        const assetRepo = core.getInput('repo', { required: false }) || currentRepo
        const assetTag = core.getInput('asset_tag', { required: false } || 'Latest')

        await octokit.repos.deleteReleaseAsset(

        )
        // Getting the uploadUrl of the Release with the Latest tag
        const releaseIdResponse = await octokit.repos.getReleaseByTag({
            owner: assetOwner,
            repo: assetRepo,
            tag: assetTag
        })
        // The releaseId with specified tag
        const releaseId = releaseIdResponse.data
        core.info(`Id of the Repo with tag: ${assetTag} is ${releaseId}`)

        //Getting all release assets
        const releaseAssetsResponse = await octokit.repos.listReleaseAssets({
            owner: assetOwner,
            repo: assetRepo,
            release_id: releaseId
        })

        // Deleting all Assets from specified tag
        const releaseAsset = releaseAssetsResponse.data
        releaseAsset.forEach((assetId) => {
            octokit.repos
                .deleteReleaseAsset({
                    owner: assetOwner,
                    repo: assetRepo,
                    asset_id: assetId
                })
                .then()
            core.info(`- Deleting asset with id: ${assetId}`)
        })

        core.info("The action was successfully executed!");
    } catch (error) {
        core.setFailed(error.message)
    }
})();