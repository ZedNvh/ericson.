module.exports.config = {
 name: "sing",
 version: "2.0.4",
 role: 0,
 credits: "zach",
 description: "Play a song",
 aliases: ["sing"],
cooldown: 0,
hasPrefix: true,
	usage: "",
};

	  
	  const fs = require('fs-extra');
	  const ytdl = require('@distube/ytdl-core');
	  const Youtube = require('youtube-search-api');
	  const convertHMS = (value) => new Date(value * 1000).toISOString().slice(11, 19);
	  
	  const downloadMusicFromYoutube = async (link, path, itag = 249) => {
		try {
			var timestart = Date.now();
			var data = await ytdl.getInfo(link)
			var result = {
				title: data.videoDetails.title,
				dur: Number(data.videoDetails.lengthSeconds),
				viewCount: data.videoDetails.viewCount,
				likes: data.videoDetails.likes,
				author: data.videoDetails.author.name,
				timestart: timestart
					  }
			return new Promise((resolve, reject) => {
				ytdl(link, {
					filter: format => format.itag == itag
				}).pipe(fs.createWriteStream(path)).on('finish', () => {
					resolve({
						data: path,
						info: result
					})
				})
			})
		} catch (e) {
			return console.log(e)
		}
	  }
	  
	  const handleReply = async ({ api, event, handleReply }) => {
		try {
			const path = `${__dirname}/cache/sing-${event.senderID}.mp3`;
			const { data, info } = await downloadMusicFromYoutube("https://www.youtube.com/watch?v=" + handleReply.link[event.body - 1], path);
	  
			if(fs.statSync(data).size > 26214400) return api.sendMessage('The file could not be sent because it is larger than 25MB.', event.threadID, () => fs.unlinkSync(path), event.messageID);
			api.unsendMessage(handleReply.messageID);
			const message = {
				body: `╭┈ ❒ 𝖳𝗂𝗍𝗅𝖾: ${info.title}\n╰┈➤ 𝖳𝗂𝗆𝖾: ${convertHMS(info.dur)}\n╰┈➤ 𝖯𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗍𝗂𝗆𝖾: ${Math.floor((Date.now() - info.timestart) / 1000 )} 𝗌𝖾𝖼𝗈𝗇𝖽𝗌\n`,
				attachment: fs.createReadStream(data),
			};
			return api.sendMessage(message, event.threadID, async() => {
				fs.unlinkSync(path)
				//iphone
				// const { data, info } = await downloadMusicFromYoutube("https://www.youtube.com/watch?v=" + handleReply.link[event.body - 1], path, 18);
				// if(fs.statSync(data).size > 26214400) return
				// const message = {
				//     body: `🎵 Title: ${info.title}\n⏱️ Time: ${convertHMS(info.dur)}\n⏱️Processing time: ${Math.floor((Date.now() - info.timestart) / 1000 )} seconds`,
				//     attachment: fs.createReadStream(data),
				// };
				// return api.sendMessage(message, event.threadID, async() => fs.unlinkSync(path), event.messageID);
			}, event.messageID);
		} catch (error) {
			console.log(error);
		}
	  };
	  
	  const run = async function ({ api, event, args }) {
		if (!args?.length) return api.sendMessage('› 𝘚𝘦𝘢𝘳𝘤𝘩 𝘤𝘢𝘯𝘯𝘰𝘵 𝘣𝘦 𝘭𝘦𝘧𝘵 𝘣𝘭𝘢𝘯𝘬!', event.threadID, event.messageID);
	  
		const keywordSearch = args.join(" ");
		const path = `${__dirname}/cache/sing-${event.senderID}.mp3`;
	  
		if (args[0]?.startsWith("https://")) {
			try {
				const { data, info } = await downloadMusicFromYoutube(args[0], path);
				const body = `╭┈ ❒ 🎵 𝖳𝗂𝗍𝗍𝗅𝖾: ${info?.title ?? 'Unknown'}\n╰┈➤ ⏱️ 𝖳𝗂𝗆𝖾: ${convertHMS(info?.dur)}\n╰┈➤ ⏱️ 𝖯𝗋𝗈𝖼𝖾𝗌𝗌𝗂𝗇𝗀 𝗍𝗂𝗆𝖾: ${Math.floor((Date.now()- info?.timestart)/1000)} 𝗌𝖾𝖼𝗈𝗇𝖽𝗌`;
	  
	  
				if (fs.statSync(data).size > 26214400) { return api.sendMessage('The file could not be sent because it is larger than 25MB.', event.threadID, () => fs.unlinkSync(data), event.messageID); }
			  const formattedAnswer = formatFont(boddy);
	  
				return api.sendMessage({ formattedAnswer, attachment: fs.createReadStream(data) }, event.threadID, () => fs.unlinkSync(data), event.messageID);
			} catch (e) {
				return console.log(e);
			}
		} else {
			try {
				const data = (await Youtube.GetListByKeyword(keywordSearch, false, 5))?.items ?? [];
				const link = data.map(value => value?.id);
				const body = `[🔎] 𝗧𝗵𝗲𝗿𝗲 𝗮𝗿𝗲 ${link.length} 𝗿𝗲𝘀𝘂𝗹𝘁𝘀 𝗺𝗮𝘁𝗰𝗵𝗶𝗻𝗴 𝘆𝗼𝘂𝗿 𝘁𝗲𝗿𝗺:\n\n${data.map((value, index) => `${index + 1} - ╭┈ ❒ Title: ${value?.title}\n      ╰┈➤ Time: (${value?.length?.simpleText})\n\n`).join('')}› 𝗣𝗹𝗲𝗮𝘀𝗲 𝗿𝗲𝗽𝗹𝘆 𝘀𝗲𝗹𝗲𝗰𝘁 𝗼𝗻𝗲 𝗼𝗳 𝘁𝗵𝗲 𝗮𝗯𝗼𝘃𝗲 𝗼𝗳 𝘀𝗲𝗮𝗿𝗰𝗵𝗲𝘀.`;
			  const formattedAnswer = formatFont(body);
	  
				return api.sendMessage(formattedAnswer, event.threadID, (error, info) => global.client.handleReply.push({
					type: 'reply',
					name: config.name,
					messageID: info.messageID,
					author: event.senderID,
					link
				}), event.messageID);
			} catch (e) {
				return api.sendMessage(`An error occurred, please try again in a moment!!\n${e}`, event.threadID, event.messageID);
			}
		}
	  };
	  
	  function formatFont(text) {
		const fontMapping = {
		a: "𝖺",
		b: "𝖻",
		c: "𝖼",
		d: "𝖽",
		e: "𝖾",
		f: "𝖿",
		g: "𝗀",
		h: "𝗁",
		i: "𝗂",
		j: "𝗃",
		k: "𝗄",
		l: "𝗅",
		m: "𝗆",
		n: "𝗇",
		o: "𝗈",
		p: "𝗉",
		q: "𝗊",
		r: "𝗋",
		s: "𝗌",
		t: "𝗍",
		u: "𝗎",
		v: "𝗏",
		w: "𝗐",
		x: "𝗑",
		y: "𝗒",
		z: "𝗓",
		A: "𝖠",
		B: "𝖡",
		C: "𝖢",
		D: "𝖣",
		E: "𝖤",
		F: "𝖥",
		G: "𝖦",
		H: "𝖧",
		I: "𝖨",
		J: "𝖩",
		K: "𝖪",
		L: "𝖫",
		M: "𝖬",
		N: "𝖭",
		O: "𝖮",
		P: "𝖯",
		Q: "𝖰",
		R: "𝖱",
		S: "𝖲",
		T: "𝖳",
		U: "𝖴",
		V: "𝖵",
		W: "𝖶",
		X: "𝖷",
		Y: "𝖸",
		Z: "𝖹"
	  };
	  
	  let formattedText = "";
	  for (const char of text) {
		if (char in fontMapping) {
		  formattedText += fontMapping[char];
		} else {
		  formattedText += char;
		}
	  }
	  return formattedText;
	  }
	  
	  
	  module.exports = { config, run, handleReply };