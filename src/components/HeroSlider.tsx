'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Icon from './Icon';

interface HeroSlide {
  type?: string;
  title: string;
  href: string;
  meta: string;
  excerpt?: string;
  cover?: string;
  icon: string;
  label: string;
  pillClass: string;
}

interface HeroSliderProps {
  posts: HeroSlide[];
}

export default function HeroSlider({ posts }: HeroSliderProps) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = posts.length;

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 6000);
  }, [total]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  const goTo = useCallback(
    (index: number) => {
      setCurrent(index);
      resetTimer();
    },
    [resetTimer],
  );

  const prev = useCallback(() => {
    goTo((current - 1 + total) % total);
  }, [current, total, goTo]);

  const next = useCallback(() => {
    goTo((current + 1) % total);
  }, [current, total, goTo]);

  if (!posts.length) return null;

  return (
    <section className="hero-slider" id="hero-slider">
      <div className="hero-slider-viewport">
        <div
          className="hero-slider-track"
          id="slider-track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {posts.map((post) => (
            <article key={post.href} className="hero-slide">
              <a className="hero-slide-link" href={post.href}>
                <div className="hero-slide-media">
                  {post.cover ? (
                    <img src={post.cover} alt="" loading="lazy" />
                  ) : (
                    <div className="hero-slide-placeholder">
                      <Icon name={post.icon as any} size={56} />
                    </div>
                  )}
                </div>
                <div className="hero-slide-body">
                  <div className={`hero-slide-pill ${post.pillClass}`}>
                    <Icon name={post.icon as any} />
                    {post.label}
                  </div>
                  <h3 className="hero-slide-title">{post.title}</h3>
                  <p className="hero-slide-meta">{post.meta}</p>
                  {post.excerpt && <p className="hero-slide-excerpt">{post.excerpt}</p>}
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
      <div className="hero-slider-controls">
        <button className="hero-slider-btn" onClick={prev} aria-label="Previous slide">
          {'\u2039'}
        </button>
        <div className="hero-slider-dots">
          {posts.map((_, i) => (
            <button
              key={i}
              className={`hero-slider-dot${i === current ? ' active' : ''}`}
              data-index={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
        <button className="hero-slider-btn" onClick={next} aria-label="Next slide">
          {'\u203a'}
        </button>
      </div>
    </section>
  );
}
