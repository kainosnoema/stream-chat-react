import { EventCard } from './EventCard';

import { Card1, Card2, HackerSummitLogo, HackerSummitHero } from '../../assets';
import {
  CrowdStrike,
  Cybereason,
  GoGuardian,
  LogRhythm,
  RedCanary,
  Symantec,
} from '../../assets/companyLogos';

import './OverviewContainer.scss';

const eventText = (
  <div>
    <p>Welcome to the inaugural World Hacker Summit!</p>
    <p>
      The goal of today's event is to spotlight innovative thought leaders and to provide an
      opportunity to share and exchange new ideas, technology trends and networking. Click here to
      watch a two-minute tutorial with step-by-step instruction for how you can best maximize
      today's in-platform experience. We encourage you to view the event schedule and to take full
      advantage of all that this dynamic virtual event platform has to offer!
    </p>
    <ul>
      <li>
        Engage in real-time networking and Q&A opportunities on a local, national, and global level.
      </li>
      <li>
        Grow your personal brand and your community in the "Networking" area. Here you will get
        paired with like minded individuals for 1:1 conversation.
      </li>
      <li>
        Take your virtual connections one step further — by initiating a request to schedule a
        meeting or sending a direct message with anyone in the "Participants" tab. You will have the
        opportunity to connect in a private conversation or private video session with up to 9 other
        people.
      </li>
    </ul>
    <p>
      Enjoy today's event and don't forget to download your virtual passport for your chance to win.
      Contest details are noted below:
    </p>
    <ol>
      <li>Download Your Virtual Passport.</li>
      <li>
        Engage with booth representatives and ask for their unique booth code. It's that easy!
      </li>
      <li>
        Enter the code of each booth you visit in the corresponding passport field, along with your
        full name. To qualify, we ask that you visit a minimum of 4 booths.
      </li>
      <li>
        Submit your completed passport to Dorah Nielsen at dorah.nielsen@whs.com by 10 a.m. EST on
        3/6.
      </li>
      <li> Stay tuned. Winners will be announced on 3/6 on our social media sites!</li>
    </ol>
  </div>
);

export const OverviewContainer = () => {
  return (
    <div className='overview-container'>
      <div className='overview-header'>
        <HackerSummitHero />
      </div>
      <div className='overview-tabs'>
        <span>Description</span>
        <span>Partners</span>
        <span>Schedule</span>
        <span>Speakers</span>
      </div>
      <div className='overview-title'>
        <div className='overview-title-content'>
          <div className='overview-title-icon'>
            <HackerSummitLogo />
          </div>
          <div className='overview-title-header'>
            <span className='overview-title-header-main'>World Hacker Summit 2021</span>
            <div className='overview-title-header-sub'>
              <span className='overview-title-header-sub-left'>Presented by</span>
              <span className='overview-title-header-sub-right'>Stream</span>
            </div>
          </div>
        </div>
        <div className='overview-title-date'>
          <div className='overview-title-date-icon'>
            <div>Day</div>
            <div className='overview-title-date-number'>1</div>
          </div>
        </div>
      </div>
      <div className='overview-content'>
        <div className='overview-content-container'>
          <div className='overview-content-title'>Description</div>
          <div className='overview-content-content'>{eventText}</div>
        </div>
        <div className='overview-content-stats'>
          <div className='overview-content-stats-title'>Stats</div>
          <div className='overview-content-stats-stat'>
            <div className='overview-content-stats-total'>2</div>
            <div className='overview-content-stats-description'>Days</div>
          </div>
          <div className='overview-content-stats-stat'>
            <div className='overview-content-stats-total'>4</div>
            <div className='overview-content-stats-description'>Main event</div>
          </div>
          <div className='overview-content-stats-stat'>
            <div className='overview-content-stats-total'>38</div>
            <div className='overview-content-stats-description'>Rooms</div>
          </div>
          <div className='overview-content-stats-stat'>
            <div className='overview-content-stats-total'>120</div>
            <div className='overview-content-stats-description'>Speakers</div>
          </div>
          <div className='overview-content-stats-stat'>
            <div className='overview-content-stats-total'>2k</div>
            <div className='overview-content-stats-description'>Tickets sold</div>
          </div>
        </div>
      </div>
      <div className='overview-partners'>
        <div className='overview-partners-title'>Partners</div>
        <div className='overview-partners-logos'>
          <img alt='RedCanary' src={RedCanary} />
          <img alt='Symantec' src={Symantec} />
          <img alt='CrowdStrike' src={CrowdStrike} />
          <img alt='Cybereason' src={Cybereason} />
          <img alt='GoGuardian' src={GoGuardian} />
          <img alt='LogRhythm' src={LogRhythm} />
        </div>
      </div>
      <div className='overview-schedule'>
        <div className='overview-schedule-title'>Schedule</div>
        <EventCard
          chatType='main-event'
          content='How to set a business plans to use information to a competitive advantage and support enterprise goals.'
          eventName='cybersecurity'
          Image={Card1}
          label='Moderated'
          presenters={6}
          title='Implementing a Cybersecurity Framework'
          viewers={150}
        />
        <EventCard
          chatType='room'
          content='ESG Regulations, Standards and Disclosure: Who to publish it for and how to make it meaningful.'
          eventName='esg'
          Image={Card2}
          label='Private'
          presenters={2}
          title='ESG Data - How to create it'
          viewers={150}
        />
      </div>
    </div>
  );
};