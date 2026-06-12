export const getFallbackToolIcon = (subId: string, subTitle: string, contentUrl?: string): string => {
  const id = subId.toLowerCase();
  
  if (id.includes('khtn-6')) return 'https://img.icons8.com/fluency/96/microscope.png';
  if (id.includes('khtn-7')) return 'https://img.icons8.com/fluency/96/test-tube.png';
  if (id.includes('khtn-8')) return 'https://img.icons8.com/fluency/96/physics.png';
  if (id.includes('khtn-9')) return 'https://img.icons8.com/color/96/round-bottom-flask.png';
  
  if (id.includes('phieu-bai-hoc')) return 'https://img.icons8.com/fluency/96/notebook.png';
  if (id.includes('mindmap')) return 'https://img.icons8.com/fluency/96/mind-map.png';
  if (id.includes('tao-de') || id.includes('de-kiem-tra') || id.includes('app-tao-de')) return 'https://img.icons8.com/fluency/96/artificial-intelligence.png';
  
  if (id.includes('chatgpt')) return 'https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128';
  if (id.includes('gemini')) return 'https://www.google.com/s2/favicons?domain=gemini.google.com&sz=128';
  if (id.includes('claude')) return 'https://www.google.com/s2/favicons?domain=claude.ai&sz=128';
  if (id.includes('copilot')) return 'https://www.google.com/s2/favicons?domain=copilot.microsoft.com&sz=128';
  if (id.includes('grok')) return 'https://www.google.com/s2/favicons?domain=grok.com&sz=128';
  if (id.includes('deepseek')) return 'https://www.google.com/s2/favicons?domain=deepseek.com&sz=128';
  if (id.includes('meta')) return 'https://www.google.com/s2/favicons?domain=meta.ai&sz=128';
  if (id.includes('notion')) return 'https://www.google.com/s2/favicons?domain=notion.so&sz=128';
  if (id.includes('cursor')) return 'https://www.google.com/s2/favicons?domain=cursor.com&sz=128';
  if (id.includes('zapier')) return 'https://www.google.com/s2/favicons?domain=zapier.com&sz=128';
  if (id.includes('replit')) return 'https://www.google.com/s2/favicons?domain=replit.com&sz=128';
  if (id.includes('framer')) return 'https://www.google.com/s2/favicons?domain=framer.com&sz=128';
  if (id.includes('canva')) return 'https://www.google.com/s2/favicons?domain=canva.com&sz=128';
  
  if (id.includes('game-quiz') || id.includes('do-vui')) return 'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2F%C4%91%E1%BB%91_vui-removebg-preview.png?alt=media&token=b096c8f7-0557-466f-b0bc-162ba3e0c632';
  if (id.includes('game-puzzle') || id.includes('manh-ghep')) return 'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fl%E1%BA%ADt_m%E1%BA%A3nh_gh%C3%A9p-removebg-preview.png?alt=media&token=00b1a2e0-bad6-4e40-b15a-6f50de9b14c2';
  if (id.includes('duck-race') || id.includes('dua-vit')) return 'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2F%C4%91ua_v%E1%BB%8Bt-removebg-preview.png?alt=media&token=1a850b85-12b2-4631-93db-b865918bbcd6';
  if (id.includes('game-hub') || id.includes('ngan-hang')) return 'https://img.icons8.com/fluency/96/data-configuration.png';
  if (id.includes('star-race') || id.includes('ngoi-sao')) return 'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fcu%E1%BB%99c_%C4%91ua_ng%C3%B4i_sao-removebg-preview.png?alt=media&token=166600dd-d3f0-47c2-8349-f25708f26bc8';
  if (id.includes('world-explorer') || id.includes('kham-pha-the-gioi')) return 'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fkh%C3%A1m_ph%C3%A1_th%E1%BA%BF_gi%E1%BB%9Bi-removebg-preview.png?alt=media&token=348022b3-50b9-4900-a811-cc2be4764b95';
  if (id.includes('spin-wheel') || id.includes('vong-quay')) return 'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fv%C3%B2ng_quay-removebg-preview.png?alt=media&token=cb957052-3341-459f-8665-11e65b541418';
  if (id.includes('keo-co')) return 'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fk%C3%A9o_co-removebg-preview.png?alt=media&token=8c7a6aa3-fc3a-4d4e-bf6d-d0d0afc3d70e';
  if (id.includes('doi-khang')) return 'https://img.icons8.com/fluency/96/lightning-bolt.png';
  if (id.includes('chem-hoa-qua')) return 'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fch%C3%A9m_tr%C3%A1i_c%C3%A2y-removebg-preview.png?alt=media&token=ff9140ef-3447-402e-9dba-8bd54ca491f1';
  if (id.includes('theo-luot')) return 'https://img.icons8.com/fluency/96/dice.png';
  if (id.includes('crossword') || id.includes('o-chu')) return 'https://img.icons8.com/fluency/96/crossword.png';
  if (id.includes('game-giai-ma-buc-tranh')) return 'https://img.icons8.com/fluency/96/picture.png';
  if (id.includes('game-dai-duong-ma-thuat')) return 'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2F%C4%91%E1%BA%A1i_d%C6%B0%C6%A1ng_ma_thu%E1%BA%ADt-removebg-preview.png?alt=media&token=9efe7408-bfd0-4df1-a2c2-b95256ae0ced';
  if (id.includes('game-ai-la-trieu-phu')) return 'https://firebasestorage.googleapis.com/v0/b/giaovien40-b080f.firebasestorage.app/o/images%2Fai_l%C3%A0_tri%E1%BB%87u_ph%C3%BA-removebg-preview.png?alt=media&token=9fa001c0-9d5d-4b96-a721-0799ed5c96a8';
  
  if (id.startsWith('ai-') && contentUrl) {
    try {
      const parsedUrl = new URL(contentUrl);
      return `https://www.google.com/s2/favicons?domain=${parsedUrl.hostname}&sz=128`;
    } catch {}
  }
  return 'https://img.icons8.com/fluency/96/books.png';
};
