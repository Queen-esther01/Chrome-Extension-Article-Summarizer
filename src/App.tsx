import { useEffect, useState } from 'react'
import './App.css'
import { HfInference } from '@huggingface/inference'
/// <reference types="chrome-types" />

function App() {

	const [result, setResult] = useState('')
	const [prompt, setPrompt] = useState('')
	const [isSummarizing, setIsSummarizing] = useState(false)
	const [hasArticle, setHasArticle] = useState(false)
	const [checkForArticle, setCheckForArticle] = useState(false)
	const [error, setError] = useState('')

	const hf = new HfInference(import.meta.env.VITE_HF_TOKEN)
	// console.log(hf)
	const summarize = async() => {
		try {
			setIsSummarizing(true)
			console.log('summarizing...')
			const result = await hf.summarization({
				model: 'facebook/bart-large-cnn',
				parameters: {
					max_length: 1000
				},
				inputs: `${prompt}` || `The tower is 324 meters tall`
			})
			console.log(result)
			console.log('result', result.summary_text)
			setResult(result.summary_text)
			setIsSummarizing(false)
		} catch (error) {
			console.log('error summarizing: ', error)
			setError('Error summarizing: ' + JSON.stringify(error))
			setIsSummarizing(false)
		}
	}

	// Get the current active tab
	useEffect(() => {
		const getCurrentTab = async () => {
			if (typeof chrome !== 'undefined' && chrome.tabs) {
				try {
					setCheckForArticle(true)
					console.log('checking for article...')
					const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
					if (!tab.id) return;
					console.log("Current tab:", tab);
					console.log("Tab URL:", tab.url);
					console.log("Tab title:", tab.title);

					// Execute script in the active tab
					const [result] = await chrome.scripting.executeScript({
						target: { tabId: tab.id },
						func: () => {
							const article = document.querySelector('article');
							if (!article) {
								return {
									hasArticle: false,
									content: 'No article tag found on this page'
								}
							}
						// Get text content while preserving paragraph breaks
						const textContent = Array.from(article.childNodes)
							.map(node => {
								// If it's a text node, return its content
								if (node.nodeType === Node.TEXT_NODE) {
									return node.textContent;
								}
								// If it's an element, get its text content
								// Add a newline after paragraphs and headings
								if (node.nodeType === Node.ELEMENT_NODE) {
									const tag = (node as Element).tagName.toLowerCase();
									const text = node.textContent;
									return tag.match(/^(p|h[1-6]|div|br)$/) ? `${text}\n` : text;
								}
								return '';
							})
							.join('')
							.trim()
							.replace(/\n\s+/g, '\n') // Remove extra spaces at start of lines
							.replace(/\n{3,}/g, '\n\n'); // Replace multiple newlines with double newlines

							return {
								hasArticle: true,
								content: textContent || 'No content found within article tag'
							};
						},
					});
					setHasArticle(result.result?.hasArticle || false)
					setCheckForArticle(false)
					setPrompt(result.result?.content?.substring(0, 1000) || '')
				} catch (error) {
					setCheckForArticle(false)
					setError('Error accessing tab: ' + JSON.stringify(error))
					console.error("Error accessing tab:", error);
				}
			} else {
				setCheckForArticle(false)
				console.log("Chrome API not available - development mode.");
			}
		};

		getCurrentTab();
	}, [])
	
	return (
		<>
			{checkForArticle && <p>Checking for article...</p>}
			{hasArticle && <p>We found an article! Tap 'Summarize' for a quick overview.</p>}
			{!hasArticle && <p>Oops! No article here to summarize.</p>}
			<button disabled={!hasArticle} onClick={() => summarize()}>Summarize</button>
			<div>
				{isSummarizing && <p>Summarizing...</p>}
				<p className='text-lg'>{result}</p>
			</div>
		</>
	)
}

export default App
