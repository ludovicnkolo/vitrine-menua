import React from 'react';

const SectionBlock = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div>
    <h2 className="text-[1.2rem] font-bold text-[#141824] uppercase tracking-widest mb-6 border-b border-[#e8e1d7] pb-3">
      {title}
    </h2>
    {children}
  </div>
);

export default SectionBlock;
