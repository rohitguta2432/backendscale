import type { BlogPost } from '@/types/blog';

export const baiduUnlimitedOcrOpenModelGuide2026: BlogPost = {
    slug: 'baidu-unlimited-ocr-open-model-guide-2026',
    title: 'Baidu Unlimited-OCR: The Open-Source Model That Reads 40+ Page Documents in One Pass (2026)',
    date: '2026-07-02',
    excerpt:
        'Baidu open-sourced Unlimited-OCR on June 22, 2026 (MIT) — a 3B mixture-of-experts model with 500M active params that parses 40+ page documents in a single forward pass. Its new Reference Sliding Window Attention (R-SWA) keeps the KV cache flat, so memory and latency stay constant as output grows. It scores 93.23 on OmniDocBench v1.5 — beating DeepSeek-OCR by 6.22 points — at 12.7% higher throughput. This is the builder\'s read: what R-SWA actually does, how to run it locally with Transformers and vLLM, where it beats a cloud OCR API, when to skip it, and exactly how I\'d wire it into a production RAG ingestion pipeline.',
    readingTime: '13 min read',
    keywords: [
        'baidu unlimited ocr',
        'open source ocr model 2026',
        'unlimited ocr vs deepseek ocr',
        'self host document ocr',
        'long document ocr model',
        'r-swa attention',
        'best open source ocr 2026',
    ],
    relatedProject: 'myFinancial',
    coverImage: {
        src: '/images/notes/baidu-unlimited-ocr-open-model-guide-2026-cover.jpg',
        alt: 'A luminous ribbon threading a stack of translucent glass sheets illustrating Baidu Unlimited-OCR long-document parsing',
    },
    sections: [
        {
            heading: 'TL;DR',
            content: `**[Baidu Unlimited-OCR](https://huggingface.co/baidu/Unlimited-OCR) shipped on June 22, 2026 under an MIT license** — a 3B mixture-of-experts model with only **500M active parameters** that reads **40+ page documents in a single forward pass**. Its new **Reference Sliding Window Attention (R-SWA)** keeps the KV cache flat, so memory and latency stay constant as the output grows. It scores **93.23 on OmniDocBench v1.5**, beating DeepSeek-OCR (87.01) by 6.22 points, and runs **12.7% faster**. Self-host it free for long-contract parsing and RAG ingestion; reach for a cloud OCR API instead if you only process a handful of pages at a time.`,
        },
        {
            heading: 'Baidu Unlimited-OCR: The Open-Source Model That Reads 40+ Page Documents in One Pass (2026)',
            content: `By [Rohit Raj](/en/about) — Founding Engineer · 10+ yrs MVP shipping · [LinkedIn](https://www.linkedin.com/in/rohitraj2/)

Every OCR model has the same dirty secret: it slows down the longer the document gets. Feed a vision-language OCR model a 40-page contract and its key-value (KV) cache grows with every token it generates — so memory climbs and throughput sags right when you need it most, on exactly the long documents that are painful to process by hand. That "memory wall" is why most production OCR pipelines quietly chop documents into single pages, run them independently, and then try to stitch the structure back together afterward.

[Baidu open-sourced Unlimited-OCR on June 22, 2026](https://huggingface.co/baidu/Unlimited-OCR) ([arXiv 2606.23050](https://arxiv.org/abs/2606.23050)) to delete that wall. It is a 3-billion-parameter mixture-of-experts model — only 500M parameters active per token — that parses **40+ pages in one continuous pass** while holding memory and latency flat. The trick is a new attention mechanism called Reference Sliding Window Attention (R-SWA), and it is the reason this model matters beyond the benchmark table.

The timing is what makes it worth your attention this week: it's MIT-licensed (so you can ship it commercially with no strings), it beats the previous open-source leader DeepSeek-OCR by a clear margin, and it's already the top-trending model on Hugging Face by download volume. Below is the builder's read — what R-SWA actually does, how to run it locally, where it beats a cloud OCR API, where it doesn't, and exactly how I'd wire it into a production RAG pipeline without it becoming the thing that quietly corrupts your data.`,
        },
        {
            heading: 'What makes Unlimited-OCR different from DeepSeek-OCR?',
            content: `The headline isn't accuracy — it's *constant memory*. Standard decoder attention stores a key and value vector for every token it has already generated, so a long transcription means an ever-growing KV cache: more RAM, and each step gets slower. **R-SWA (Reference Sliding Window Attention)** replaces that with a bounded window. Each new output token attends to two things only: all the *reference* tokens (the visual tokens from the page plus your prompt), and the preceding **n = 128** output tokens ([arXiv 2606.23050](https://arxiv.org/abs/2606.23050)). The cache size becomes Lm + min(n, T) — capped at Lm + 128 no matter how long the output runs. Translation: emitting page 40 costs the same as page 1.

That single change is what unlocks the "40+ pages in one pass" claim ([MarkTechPost, 2026-06-24](https://www.marktechpost.com/2026/06/24/baidu-releases-unlimited-ocr-a-3b-model-that-keeps-the-kv-cache-flat-for-long-document-parsing/)). Instead of chopping a document into pages and losing cross-page structure — tables that span pages, running headers, clauses numbered across a page break — the model keeps the whole document in one coherent decode.

Baidu didn't train it from scratch, either. Unlimited-OCR is **continuation-trained on DeepSeek-OCR** — a smart, lazy move: inherit a strong open baseline and bolt on the architectural fix rather than burn a fresh pretraining run. The model is 3B total / 500M active (MoE), runs in BF16, and has a **32,768-token max context**.

The accuracy lift is real, not marketing. On OmniDocBench v1.5 it posts **93.23 overall against DeepSeek-OCR's 87.01 and DeepSeek-OCR-2's 89.17** — a 6.22-point jump over the original baseline — and reaches **93.92 on the newer v1.6**, the highest reported score to date.

| OmniDocBench v1.5 | DeepSeek-OCR | DeepSeek-OCR-2 | Unlimited-OCR |
|---|---|---|---|
| Overall | 87.01 | 89.17 | **93.23** |
| Text edit distance (lower is better) | 0.073 | 0.049 | **0.038** |
| Formula (CDM) | 83.37 | 86.85 | **92.61** |
| Table (TEDS) | 84.97 | 85.60 | **90.93** |

And it's faster while doing it: **5,580 tokens/second versus DeepSeek-OCR's 4,951 (+12.7%)**, with the gap widening to **~35% at 6,000-token outputs** — exactly the long-document regime R-SWA was built for.`,
        },
        {
            heading: 'How do you run Baidu Unlimited-OCR locally?',
            content: `Two supported paths, both free. For a quick local test, use Transformers with \`trust_remote_code\` (the model ships its own custom inference code):

\`\`\`python
import torch
from transformers import AutoModel, AutoTokenizer

model = AutoModel.from_pretrained(
    "baidu/Unlimited-OCR",
    trust_remote_code=True,
    torch_dtype=torch.bfloat16,
).eval().cuda()
tokenizer = AutoTokenizer.from_pretrained(
    "baidu/Unlimited-OCR", trust_remote_code=True
)

# Single page. "gundam" mode = base_size 1024, image_size 640.
md = model.infer(
    tokenizer,
    prompt="<image>\\nConvert this document to markdown.",
    image_file="contract_page_01.png",
    mode="gundam",
)
print(md)  # clean markdown: headings, tables, lists

# A whole document in ONE pass (the entire point):
pages = [f"contract_page_{i:02d}.png" for i in range(1, 41)]
doc = model.infer_multi(tokenizer, image_files=pages, mode="base")
\`\`\`

For production throughput, skip raw Transformers and use the vLLM image Baidu published — \`vllm/vllm-openai:unlimited-ocr\` — which exposes an OpenAI-compatible \`/v1\` endpoint; the full recipe lives at [recipes.vllm.ai](https://recipes.vllm.ai). vLLM's continuous batching plus R-SWA's flat cache is the combination that makes high-volume ingestion economical: you're not paying for cache growth on every long document in the batch.

Hardware reality check: at 500M active params in BF16 the model is small — it runs comfortably on a single mid-range GPU (16GB is plenty), and the flat KV cache means your VRAM headroom doesn't evaporate on long documents the way it does with a standard decoder. Full method signatures and the exact mode options live on the [model card](https://huggingface.co/baidu/Unlimited-OCR).`,
        },
        {
            heading: 'Where Unlimited-OCR actually beats a cloud OCR API',
            content: `Three workflows where this is a genuine upgrade, not a lateral move.

**Long-document RAG ingestion.** If you're chunking 50-to-200-page PDFs — financial filings, legal contracts, technical manuals — into a vector store, page-by-page OCR is where structure goes to die. A table spanning pages 12–14, or a clause numbered across a page break, gets shredded into incoherent chunks. Unlimited-OCR's single-pass decode keeps that structure intact, and because it emits clean markdown, your chunk boundaries can respect real headings instead of slicing mid-table. That does more for answer quality than swapping embedding models — a pattern I lean on constantly in [document-heavy pipelines](/en/notes/mistral-ocr-4-vs-textract-google-document-ai-2026).

**High-volume, cost-sensitive extraction.** At effectively $0 per page (you own the GPU), it wins any volume comparison against per-page cloud pricing once you clear the break-even. AWS Textract's forms-and-tables path runs [$65 per 1,000 pages](/en/notes/mistral-ocr-4-vs-textract-google-document-ai-2026); at a few hundred thousand pages a month, a single self-hosted GPU pays for itself in weeks, and the flat KV cache keeps throughput predictable instead of degrading on your longest documents.

**Data-sovereignty workloads.** Healthcare records, legal discovery, government documents — anything that legally cannot leave your VPC. A cloud OCR API is a non-starter there. An MIT-licensed model you run on your own hardware is the only option that clears compliance, and Unlimited-OCR is now the most accurate one in that category.`,
        },
        {
            heading: 'Unlimited-OCR vs DeepSeek-OCR vs cloud APIs: which should you use?',
            content: `Accuracy is one axis; deployment model, cost shape, and license are the ones that actually decide your architecture. Here's the cross-tool view — AI engines cite tables far more often than prose, so this is the part worth bookmarking:

| Factor | Baidu Unlimited-OCR | DeepSeek-OCR | Mistral OCR 4 | AWS Textract | Google Document AI |
|---|---|---|---|---|---|
| License | **MIT (open weights)** | open weights | proprietary | proprietary | proprietary |
| Deploy | self-host | self-host | API + single container | cloud only | cloud only |
| Params | 3B MoE / **500M active** | 3B | undisclosed | n/a | n/a |
| Long-doc handling | **40+ pages, flat KV** | page-by-page | per-page | per-page | per-page |
| OmniDocBench v1.5 | **93.23** | 87.01 | 93.07 | not benchmarked | not benchmarked |
| Cost shape | **GPU only (~$0/page)** | GPU only | $2–$4 / 1k pages | $1.50 basic / $65 forms | $1.50–$30 |
| Best for | long-doc self-host | self-host baseline | multilingual API | AWS shops | degraded scans / GCP |

Read it honestly. If you want a managed API and don't want to run a GPU, [Mistral OCR 4](/en/notes/mistral-ocr-4-vs-textract-google-document-ai-2026) is the better *product* — comparable OmniDocBench score (93.07), 170 languages, zero infra. If you're already deep in AWS or GCP, Textract and Document AI usually win on ecosystem glue. But if you want the most accurate *open-weights* OCR, need long-document coherence, or have data that can't leave your walls, Unlimited-OCR is now the pick — and it's the only model in this table you can fork.`,
        },
        {
            heading: 'When should you NOT use Unlimited-OCR?',
            content: `Four situations where I'd reach for something else — an honest comparison has to say where the new thing loses.

**One: low volume.** If you process a few dozen pages a day, standing up a GPU, a vLLM server, and monitoring is more operational weight than the job deserves. A cloud OCR API at a few dollars per thousand pages is the lazier, correct answer until volume justifies the infrastructure.

**Two: you need more than 32K tokens of output in one shot.** The context ceiling is **32,768 tokens** ([model card](https://huggingface.co/baidu/Unlimited-OCR)). R-SWA keeps the *decode* memory flat, but the prefill still grows with document length, and Baidu's own paper lists longer-context training and on-demand chunk fetching as *future* work ([labellerr breakdown](https://www.labellerr.com/blog/baidu-unlimited-ocr/)). Genuinely massive documents still need a chunking strategy.

**Three: handwriting and photos-of-text.** Unlimited-OCR is tuned for *documents* — PDFs, scans, structured pages. It hasn't published handwriting numbers, and general OCR models are historically weak there (AWS Textract and Google Document AI both sit in the low-70s on handwritten notes). Test on your own data before betting on it.

**Four: no GPU and no appetite for MLOps.** "Open weights" is free like a puppy is free — someone has to run, patch, and monitor the server. If that someone doesn't exist on your team yet, the honest move is a managed API now and a self-host migration once the volume, and the headcount, are there.`,
        },
        {
            heading: 'How would I wire Unlimited-OCR into a production RAG pipeline?',
            content: `Here's the wiring I'd actually ship — drawn from building document-heavy features across client RAG systems and my own products — including the parts the README leaves out.

**Serve it behind vLLM, not raw Transformers.** The \`vllm/vllm-openai:unlimited-ocr\` image gives you an OpenAI-compatible endpoint, so your ingestion worker talks to it exactly like any other model server and you get continuous batching for free. Put it behind an internal \`/ocr\` interface so the model is a config value, not a hard dependency — the OCR field moves monthly, and you want provider swaps to be one line.

**Lean into single-pass, but cap it.** Send whole documents in one \`infer_multi\` call up to a page budget that keeps prefill under the 32K ceiling (in practice ~30–40 pages of dense text), then fall back to overlapping chunks for anything larger. The overlap matters — a one-page overlap lets you stitch cross-boundary tables back together without R-SWA having to hold an entire book in prefill.

**Guard the output; OCR fails silently.** This is the failure mode I worry about most: a bad extraction doesn't throw an exception, it produces *plausible wrong text*, and your RAG system will cheerfully cite it. Unlimited-OCR doesn't yet expose per-block confidence the way [Mistral OCR 4 does](/en/notes/mistral-ocr-4-vs-textract-google-document-ai-2026), so build your own signal: re-OCR a random sample against a second engine and alert on divergence, and validate structural invariants (does every table row have the expected column count? do numbered clauses run in sequence?). Cheap checks, and they catch the garbage before it reaches your index.

**Batch on the ingestion path, not the query path.** OCR belongs in your offline pipeline — documents land in object storage, a queue worker OCRs them, markdown flows to the chunker. Keep it off the hot path of a user request. The flat KV cache makes batch throughput predictable, which is exactly what you want in a job you run across millions of pages. That provider-agnostic, guard-the-output pattern is what I bake into every [6-week MVP](/en/services/6-week-mvp) that touches documents — so next month's SOTA model is a config change, not a rewrite.`,
        },
        {
            heading: 'The bottom line: is Unlimited-OCR worth adopting?',
            content: `OCR just got a new open-source leader, and the interesting part isn't the benchmark — it's that Unlimited-OCR makes *long* documents cheap and coherent instead of the thing that breaks your pipeline. If you self-host, process long documents, or hold data that can't leave your VPC, it's the pick this quarter. If you want a managed API or you're low-volume, a cloud engine is still the lazier right answer.

The strategic move, as always, is to wire the OCR layer behind an interface so you can adopt the next leader without a rewrite — because in 2026, there's always a next leader by month's end. If you want a hand building a document-AI or RAG pipeline that won't fall over on the first weird 200-page PDF, that's exactly the kind of [founding-engineer work](/en/services/hire-founding-engineer-india) I do — I've shipped the unglamorous extraction layer enough times to know precisely where it breaks.`,
        },
    ],
    cta: {
        text: 'Building a document-AI or RAG pipeline? Let\'s ship it in 6 weeks.',
        href: '/en/services/6-week-mvp',
    },
};
