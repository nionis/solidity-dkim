const isDKIM = key => /^(DKIM-Signature|X-Google-DKIM-Signature)/.test(key);

module.exports = isDKIM;
