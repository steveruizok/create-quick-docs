#! /usr/bin/env node

const fs = require('fs')
const clone = require('git-clone')
const chalk = require('chalk')
const { execSync } = require('child_process')

let [, , dir = 'docs'] = process.argv

// Log messages using chalk
const clear = console.clear
const log = console.log
const err = (m) => log(chalk.yellow(m))
const term = (m) => chalk.bold.yellow(m)
const bold = (m) => chalk.bold(m)

// Start installation
function handleStart() {
	clear()
	log(bold('Creating docs starter'))
	cloneRepo()
}

function handleComplete() {
	installDependencies()

	clear()
	log(`Docs ready at /${dir}!`)
	log(``)
	log(bold(`Editing:`))
	log(`✦ Create your site's content in the ${bold(`content`)} folder.`)
	log(`✦ Edit your site's navigation in the ${bold(`content/nav`)} folder.`)
	log(`✦ Edit your site's theme in the ${bold(`src`)} folder.`)
	log(``)
	log(bold(`Running:`))
	log(`✦ Type ${term(`cd ${dir}`)} and press enter.`)
	log(`✦ Type ${term(`npm start`)} to start the local server.`)
	log(``)
	log(`Happy writing!`)
	log(``)
}

// Install dependencies in project folder
function installDependencies() {
	log('Installing dependencies – this may take a minute...')
	execSync(`cd ${dir} && npm i && rm -rf .git`)
}

// Clone repository into project folder
async function cloneRepo() {
	let hasError = false

	log(`Cloning repo into ${dir}...`)
	if (dir) {
		if (fs.existsSync(dir)) {
			fs.readdir(dir, (err, files) => {
				if (err && !files) {
					console.error('Error: Could not read from that directory.')
					hasError = true
				} else {
					if (files.length > 0) {
						console.error('Error: That directory is not empty.')
						hasError = true
					}
				}
			})
		}
	}

	if (hasError) {
		return
	}

	clone('https://github.com/steveruizok/quick-docs', `./${dir}`, {}, () => {
		handleComplete()
	})
}

// Kickoff
handleStart()
