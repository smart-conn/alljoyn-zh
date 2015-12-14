# Project and Working Group Lifecycle

## Introduction

The lifecycle defined here allows for:

  * Simple Project incubation
  * Clear guidance for Projects to graduate to a healthy Mature 
     state
  * A clear process for assigning Projects to new or existing
     Working Groups
  * A straightforward lifecycle that ensures inactive Projects 
     can be retired when necessary.

The release cycle proposed for mature Working Groups

  * Is simple and lightweight
  * Provides sufficient visibility to allow Working Groups 
     to coordinate with one another and avoid unnecessary 
     duplication of effort.

The simultaneous release process proposed lays out a simple
process for Working Groups to formally coordinate toward a 
single unified, integrated, mutually interoperating release.

## Definitions

### Service

A Service is a body of code that extends the capabilities 
of the Core. Examples of Services include support for 
device-specific features (such as the power setting on a 
microwave or the input source on a TV), or bridges that 
provide backwards and lateral compatibility support for 
protocols like DLNA.

### Project

A Project is the organizational unit that produces one or 
more Services that perform a specific function within the 
context of the AllSeen Alliance. Its use cases should be narrowly 
scoped, and it should do those things well. Projects operate 
within the open source model as defined by the Alliance, and 
are overseen by one or more Committers. Each Project must 
belong to only one Working Group.

### Working Group

A Working Group is logical grouping of one or more Projects. 
The Working Group is a meritocratic organization that follows 
open source best practices to produce code within the scope of 
the policy as set by the Technical Steering Committee and the 
Board. Project Committers make decisions within the Working 
Group, and elect the Working Group Chair as a leader and to 
represent the Working Group on the Technical Steering Committee.

## Overview

Projects are the most fundamental units of organization within 
the AllSeen Alliance. They are code-driven, meritocratic open source
projects that produce features and functionality within the 
scope of the policy as set by the Technical Steering Committee
and the board.

Each Project should be as narrowly scoped as is reasonable, to 
allow contributors to focus upon doing a few things very well.
There should be at least one Committer per Project, to ensure 
that the person or persons responsible for applying code into 
the mainline repository is familiar with the codebase.

Working Groups are logical groupings of Projects that have 
achieved Mature status. In the simplest situation, a newly 
created Project would be its own Working Group. In the case 
that multiple related Projects are created, they may be grouped 
into the same Working Group. If a Working Group no longer 
contains any Mature Projects, it will be removed.

Each Working Group is comprised of the Contributors and Committers 
of its Projects. The Committers in the Working Group will, from 
time to time, elect a single leader called the Working Group 
Chair. The Working Group Chair is responsible for overseeing 
the activities of the Working Group, and represents the Working 
Group and its Projects on the Technical Steering Committee.

## Project Types and Lifecycle

### Project States

The valid states of Projects are:

| Project Stages | Description
|----------------|------------------------------------------
| Proposal	     | Doesn't really exist yet, has no real
|                | resources, but is expected to be created
|                | due to a specific need.
| Incubation 	 | Project has resources, but is recognized 
|                | to be in the early stages and is not yet
|                | contributing product-ready code.
| Mature         | Project is a fully functioning, successful
|                | open source project that has been assigned 
|                | to a Working Group
| Archived	     | Project has been recognized as dead, and 
|                | has been archived as it's no longer a going
|                | concern.
 
### Project State Transitions

The valid transitions (and their associated reviews) are:

| From State    | To State    | Review
|---------------|-------------|-----------------
| &lt;null&gt;  | Proposal	  | &nbsp;
| Proposal	    | Incubation  | Creation Review
| Incubation    | Mature      | Graduation Review
| {Proposal, Incubation, Mature} | Archived | Termination Review

### Review processes

For each review, there will be a publicly visible wiki/web 
template filled out containing the relevant review information, 
as outlined in the sections below.

The review document must be posted and announced for public 
omment for at least 2 weeks prior to the date the review is
scheduled, to give participants sufficient time to decide.

Reviews ideally should be conducted in a manner that is sensitive 
to the global nature of the community (i.e., the geography and 
time zone dispersion).

Reviews may in some circumstances be combined (for example a 
creation and graduation review for a Project seeking to come 
into the Alliance that is already mature in its previous venue).
If reviews are combined, the review document need only be posted 
for a single 2 week review period.

####  Creation review process and criteria

  1. Proposal posted for 2 weeks of review. 
     [Proposal template][proposal-template] 
     a. Name (trademark) is OK
     b. Description is complete 
     c. Scope is well defined
     d. Resources are committed (developers committed to working)
     e. Committers are identified
     f. Meets board policy (including IPR)
     g. Proposed initial Working Group
     h. Proposal emailed to TSC mailing list allowing for 
        2 weeks of review: allseen-tsc@lists.allseenalliance.org
  2. Review by TSC and approval

#### Graduation review process and criteria

  1. Graduation Proposal posted for 2 weeks:
     a. Can demonstrate a working code base ready for 
        commercial products
     b. Has an active community
     c. Demonstrates a history of Releases (using the Mature 
        Release Process)
     d. Justifies desired Working Group (new or existing)
     e. Accepts any conditions of joining proposed Working Group
  2. Committers of the Project vote on seeking graduation
  3. Accepted by vote of Working Group, if it already exists.
     Otherwise, accepted by vote of TSC to create a new Working 
     Group using the [Creation Review process and criteria][creation-process]

[creation-process]: #creation-review-process-and-criteria

  4. Review by TSC and Approval


#### Termination Review process and criteria

  1. Termination Proposal Posted for 2 weeks:
     a. States reason for Project termination being sought
     b. Estimates impact on other Projects, users, and 
        communities, and how those will be mitigated
     c. Indicates where the Project would be archived
  2. Can be initiated by vote of committers within the Project
  3. Can be initiated by TSC or Working Group if there are 
     either no remaining committers for the Project or there 
     have been no commits to the SCM in 18 months

### Transitioning between Working Groups

From time to time Projects may have reason to change Working Group membership.  Examples include:

  * Scope of a Working Group has evolved over time and certain
    Projects no longer have obvious synergies with the rest
  * Scopes of two Working Groups have evolved over time and are
    similar enough to merit consolidation

#### Process for changing Working Group membership

  1. Working Group Change Proposal posted for 2 weeks
     a. Desired Working Group
     b. Reason for leaving existing Working Group
     c. Reason for joining new Working Group
  2. Review and approval by Committers in new Working Group
  3. Review by TSC and approval

Once a Project has been approved to move, they can participate 
immediately in Working Group activities.

## Working Groups

Each Project must be a member of a single Working Group.  
The creation of Working Groups and placement of Projects within 
them should be carefully considered to reduce the risk of
fragmentation.  New Working Groups should be created only when 
it is clear that a Project does not logically fit within the scope 
of an existing Working Group.

### Working Group States

| Working Groups | Description
|----------------|-----------------------
| Proposed	     | A Project has been accepted into the Mature 
|                | state, does not fit within the scope of any 
|                | other Working Group, and requires a new 
|                | Working Group to be created.
| Active         | Working Group contains one or more Projects 
|                | in the Mature state, and a Working Group Chair 
|                | is actively participating in the Technical
|                | Steering Committee.
| Archived       | Working Group has no remaining Projects in 
|                | the Mature state, and has been pruned from the
|                | project.

### Working Group State Transitions

The valid transitions (and their associated reviews) are:

| From State   | To State  | Review
|--------------|-----------|--------
| &lt;null&gt; | Active    | Creation Review
| Active       | Archived  | Termination Review

### Review Processes

For each review, there will be a publicly visible wiki/web 
template filled out containing the relevant review information, 
as outlined in the sections below.

The review document must be posted and announced for public 
comment for at least 2 weeks prior to the date the review 
is scheduled, to give participants sufficient time to decide.

Reviews ideally should be conducted in a manner that is sensitive 
to the global nature of the community (i.e., the geography and 
time zone dispersion).

#### Creation Review process and criteria

  1. Project makes request for a new Working Group during 
     [Graduation Review][graduation-review]
     a. Justifies need for a new Working Group instead of 
        joining an existing one
     b. Nominates the Working Group Chair
  2. Review by TSC and approval

[graduation-review]: #graduation-review-process-and-criteria

### Termination

Working Group termination is initiated automatically and 
immediately when the last Mature Project has been removed.
Situations in which this may occur include:

  * No Projects remain in the Mature state
  * Projects have been consolidated and transferred 
    to another Working Group

Working Groups with at least one Mature Project cannot be terminated. 

## Bootstrap Process

At the time of the formation of the Alliance, there are expected
to be several initial Projects contributed. These initial 
Projects will come in at various levels of maturity. In order 
to sort these Projects into the most appropriate Lifecycle state 
and Working Groups in a way that is clear, consistent, and fair:

  1. Prior to a date to be decided by the TSC in its first 
     meeting not less than 1 month and not more than 6 months 
     after the Alliance launches, a Project may decide to either
     a. Seek entry in ‘bootstrap’ state (explained more below)
     b. Seek entry via the steady state Project Lifecycle (ie,
        propose for Incubation)
  2. If a Project enters is in ‘bootstrap’ state, at the first
     meeting of the official (post-formation) TSC after it 
     petitions to exit bootstrap state, the TSC will decide 
     the proper Project Lifecycle state and Working Group for 
     the Project based on criteria rooted in the steady state 
     Project Lifecycle.
  3. Once in a non-bootstrap state, a Project follows the 
    steady state Project Lifecycle.

[proposal-template]: https://wiki.allseenalliance.org/develop/proposing_a_project
