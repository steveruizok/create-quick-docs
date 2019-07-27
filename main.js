const fs = require('fs')
const clone = require('git-clone')
const chalk = require('chalk')
const { execSync } = require('child_process')
const ora = require('ora')

let [, main, dir = 'docs'] = process.argv

// Log a message using chalk
const clear = console.clear
const log = console.log
const err = (m) => log(chalk.yellow(m))
const term = (m) => chalk.bold.yellow(m)
const bold = (m) => chalk.bold(m)

function handleStart() {
	clear()
	log(bold('Creating docs starter'))
	cloneRepo()
}

function handleComplete() {
	log(`Docs cloned!`)
	installDependencies()

	clear()
	log(`Docs ready!`)
	log(``)
	log(bold(`Editing:`))
	log(`✦ Create your site's content in the ${bold(`content`)} folder.`)
	log(`✦ Edit your site's navigation in the ${bold(`nav`)} folder.`)
	log(`✦ Edit your site's theme in the ${bold(`src`)} folder.`)
	log(``)
	log(bold(`Running:`))
	log(`✦ Type ${term(`cd ${dir}`)} and press enter.`)
	log(`✦ Type ${term(`npm run start`)} to start the local server.`)
	log(``)
	log(`Happy writing!`)
	log(``)
}

function installDependencies() {
	let spinner = ora('Installing dependencies...').start()
	execSync(`cd ${dir} && npm i`)
	spinner.stop()
}

function handleError() {
	err(`Oops, that directory (${dir}) already exists.`)
}

async function cloneRepo() {
	let spinner = ora(`Cloning repo into /${dir}...`).start()
	if (fs.existsSync(dir)) {
		spinner.stop()
		handleError()
		return
	}

	// fs.mkdir(`${dir}`, {}, () => {
	// 	console.log('entering folder')
	// 	execSync(`cd ${dir} && npm i quick-docs`)
	// })

	// execSync(`cd ${dir}`)
	// console.log('installing docs')
	// execSync(`npm i quick-docs`)
	// handleComplete()

	clone('https://github.com/steveruizok/quick-docs', `./${dir}`, {}, () => {
		spinner.stop()
		handleComplete()
	})
}

// Kickoff

handleStart()
